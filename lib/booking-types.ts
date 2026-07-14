export type BookingFieldError =
  | "name"
  | "partySize"
  | "date"
  | "package"
  | "whatsapp"
  | "notes"
  | "generic";

export type BookingFormState =
  | { status: "idle" }
  | { status: "error"; errors: BookingFieldError[] }
  | {
      status: "success";
      whatsappUrl: string;
      summary: {
        name: string;
        partySize: number;
        date: string;
        package: string;
        whatsapp: string;
        notes: string;
      };
    };
