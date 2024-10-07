import { conformZodMessage } from '@conform-to/zod';
import {z} from 'zod';

export const onboardingSchema = z.object({
    fullName: z.string().min(3).max(150),
    userName: z.string().min(3).max(150).regex(/^[a-zA-Z0-9-]+$/, {
        message: "user name can only contain letters, numbers and '-'"
    }),
});

export function onboardingSchemaValidation(options?: {
    isUserNameUnique: ()=>Promise<boolean>
}){
    return z.object({
        userName: z.string()
                    .min(3)
                    .max(150)
                    .regex(/^[a-zA-Z0-9-]+$/, {
                        message: "user name can only contain letters, numbers and '-'"
                    })
                    .pipe(
                        z.string()
                        .superRefine((_, ctx)=>{
                            if(typeof options?.isUserNameUnique !== "function"){
                                ctx.addIssue({
                                    code: "custom",
                                    message: conformZodMessage.VALIDATION_UNDEFINED,
                                    fatal: true,
                                });
                                return;
                            }

                            return options.isUserNameUnique().then((isUnique)=>{
                                if(!isUnique){
                                    ctx.addIssue({
                                        code: "custom",
                                        message: "Username is already in use."
                                    })
                                }

                            })
                        })
                    ),
        fullName: z.string().min(3).max(150),
    })
};

export const settingSchema = z.object({
    fullName: z.string().min(3).max(150),
    profileImage: z.string().nullable().optional(),
})