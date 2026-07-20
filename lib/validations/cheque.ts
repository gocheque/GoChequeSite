import { z } from "zod";

export const createChequeSchema = z.object({
  chequeNumber: z.string().min(1, "Le numéro de chèque est requis"),
  payee: z.string().min(1, "Le bénéficiaire est requis"),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  date: z.coerce.date(),
  transit: z.string().min(1, "Le transit est requis"),
  institution: z.string().min(1, "L'institution est requise"),
  accountNumber: z.string().min(1, "Le numéro de compte est requis"),
  memo: z.string().optional(),
});

export type CreateChequeInput = z.infer<typeof createChequeSchema>;
