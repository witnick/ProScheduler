"use server"
import { requireUser } from './lib/hooks';
import prisma from './lib/db';
import {eventTypeSchema, onboardingSchema, onboardingSchemaValidation, settingSchema} from './lib/zodSchemas';
import {parseWithZod} from '@conform-to/zod';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from "uuid";
import { supabase } from './lib/supabase';
import { Session } from 'next-auth';
import { revalidatePath } from 'next/cache';

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
            availability: {
                createMany: {
                    data: [
                        {
                            day: 'Monday',
                            fromTime: '08:00',
                            tillTime: '18:00',
                        },
                        {
                            day: 'Tuesday',
                            fromTime: '08:00',
                            tillTime: '18:00',
                        },
                        {
                            day: 'Wednesday',
                            fromTime: '08:00',
                            tillTime: '18:00',
                        },
                        {
                            day: 'Thursday',
                            fromTime: '08:00',
                            tillTime: '18:00',
                        },
                        {
                            day: 'Friday',
                            fromTime: '08:00',
                            tillTime: '18:00',
                        },
                        {
                            day: 'Saturday',
                            fromTime: '08:00',
                            tillTime: '18:00',
                            isActive: false
                        },
                        {
                            day: 'Sunday',
                            fromTime: '08:00',
                            tillTime: '18:00',
                            isActive: false
                        },
                    ]
                }
            }
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
    return redirect("/dashboard");

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

const getUpdatedProfileImageUrl =  async (profileImageFile: File
): Promise<string | null | undefined> => {
    const session = await requireUser();

    if (profileImageFile) {
        const profilePath = await uploadpicture(session, profileImageFile);
        const publicUrl = getProfileImagePublicUrl(session.user?.id!);
        console.log(publicUrl);
        return publicUrl;
    }
};

export const updateAvailabilityAction = async (formData: FormData)=>{
    const session = requireUser();
    const rawData = Object.fromEntries(formData.entries());

    const availabilityData = Object.keys(rawData)
                                    .filter((key)=> key.startsWith("id-"))
                                    .map((key)=>{
                                        const id = key.replace("id-", '');

                                        return {
                                            id,
                                            isActive: rawData[`isActive-${id}`] == "on",
                                            fromTime: rawData[`fromTime-${id}`] as string,
                                            tillTime: rawData[`tillTime-${id}`] as string
                                        };
                                    });
    try{
        await prisma.$transaction(
            availabilityData.map((item)=> prisma.availability.update({
                where:{
                    id: item.id
                },
                data:{
                    isActive: item.isActive,
                    fromTime: item.fromTime,
                    tillTime: item.tillTime
                }
            }))
        );
        revalidatePath("/dashboard/availability")
    }catch(e){
        console.log(e);
    }
}

export const CreateEventTypeAction = async (prevState:any, formData: FormData)=>{
    const session = await requireUser();
    const submission = parseWithZod(formData,{
        schema: eventTypeSchema
    });

    if(submission.status != "success")
            return submission.reply();

    await prisma.eventType.create({
        data: {
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            videoCallSoftware: submission.value.videoCallSoftware,
            userId:  session.user?.id
        }
    });

    return redirect("/dashboard");
}