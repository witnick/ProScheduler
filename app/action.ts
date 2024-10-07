"use server"
import { requireUser } from './lib/hooks';
import prisma from './lib/db';
import {onboardingSchema, onboardingSchemaValidation, settingSchema} from './lib/zodSchemas';
import {parseWithZod} from '@conform-to/zod';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from "uuid";
import { supabase } from './lib/supabase';
import { Session } from 'next-auth';

export const onboardingAction = async (prevState: any, formData: FormData) => {
    const session = await requireUser();

    // const submission = parseWithZod(formData, {
    //     schema: onboardingSchema
    // });

    const submission = await parseWithZod(formData,{
        schema: onboardingSchemaValidation({
            async isUserNameUnique(){
                const existingUsername = await prisma.user.findUnique({
                    where: {
                        userName: formData.get("userName") as string,
                    }
                });
                return !existingUsername;
            },
        }),
        async: true,
    });

    if(submission.status !== "success"){
        return submission.reply();
    }

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data:{
            userName: submission.value.userName,
            name: submission.value.fullName,
        }
    });

    return redirect("/onboarding/grant-id");
}

export async function SettingsAction(prevState:any, formData: FormData){

    const session = await requireUser();
    // console.log(formData.get('file'));
    const profileImgFile = formData.get('file') as File;
    
    const newProfileImageUrl = profileImgFile && await getUpdatedProfileImageUrl(profileImgFile);
    const submission = parseWithZod(formData, {
        schema: settingSchema
    });

    if(submission.status != "success"){
        return submission.reply();
    }

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data:{
            name: submission.value.fullName,
            image: newProfileImageUrl || submission.value.profileImage,
        }
    });
    //return redirect("/dashboard");

}

const uploadpicture = async (session: Session, profileImageFile: File) => {
    await supabase.storage
    .from("proscheduler").remove([`${session.user?.id}/profileImage`]);

    const { data, error } = await supabase.storage
    .from("proscheduler")
    .upload(`${session.user?.id}/profileImage`, profileImageFile);
    // console.log(data, error);
    return data?.path;
}

export const getProfileImagePublicUrl = (sessionUserId: string)=>{
    const { data } = supabase
    .storage
    .from('proscheduler')
    .getPublicUrl(`${sessionUserId}/profileImage`);
    return data.publicUrl;
}
export const getUpdatedProfileImageUrl =  async (profileImageFile: File
): Promise<string | null | undefined> => {
    const session = await requireUser();

    if (profileImageFile) {
        const profilePath = await uploadpicture(session, profileImageFile);
        const publicUrl = getProfileImagePublicUrl(session.user?.id!);
        console.log(publicUrl);
        return publicUrl;
    }
};