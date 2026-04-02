import { z } from 'zod'

export const registrationSchema = z.object({
  nomo: z.string()
    .min(1, 'Bonvolu enigi vian nomon.')
    .max(100, 'Nomo tro longa.'),
  retpoŝto: z
    .email('Retpoŝtadreso ne validas.')
    .max(255, 'Retpoŝtadreso tro longa.'),
  pasvorto: z.string()
    .min(8, 'Minimume 8 signoj.')
    .max(128, 'Pasvorto tro longa.')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Pasvorto devas enhavi literojn kaj ciferojn.'),
  konfirmo: z.string()
    .min(1, 'Bonvolu konfirmi vian pasvorton.')
}).refine((data) => data.pasvorto === data.konfirmo, {
  message: 'Pasvortoj ne kongruas.',
  path: ['konfirmo'],
})

export type RegistrationFormData = z.infer<typeof registrationSchema>
