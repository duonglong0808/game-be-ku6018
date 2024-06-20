export class SendMailDto {
  title: string;
  sendTo: string;
  heading: string;
  message: string;
  buttonLabel?: string;
  signerName: string;
  signerPhone: string;
  signerEmail: string;
  signerCompany: string;
  signerAddress: string;
  signerWebsite: string;
}
