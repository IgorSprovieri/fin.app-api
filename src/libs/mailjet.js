import Mailjet from "node-mailjet";

class EmailProvider {
  #apiKey;
  #secretKey;
  #senderAddress;
  #Mailjet;

  constructor(Mailjet) {
    const { MAILJET_API_KEY, MAILJET_SECRET_KEY, MAILJET_SENDER_ADDRESS } =
      process.env;

    this.#apiKey = MAILJET_API_KEY;
    this.#secretKey = MAILJET_SECRET_KEY;
    this.#senderAddress = MAILJET_SENDER_ADDRESS;
    this.#Mailjet = Mailjet;
  }

  async sendEmail(name, email, subject, TextPart, HTMLpart) {
    const mailjet = this.#Mailjet.apiConnect(this.#apiKey, this.#secretKey);

    return await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: this.#senderAddress,
            Name: "Equipe Fin.app",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: subject,
          TextPart: TextPart,
          HTMLPart: HTMLpart,
        },
      ],
    });
  }
}

const emailProvider = new EmailProvider(Mailjet);

export const forgotPasswordEmail = async (name, email, token) => {
  try {
    const subject = "Fin.app - Redefinir Senha";
    const TextPart = `Olá, ${name}`;
    const HTMLPart = `<br><h2>Segue abaixo o token para redefinir a sua senha:</h2>
     <br><br><br>
     <h1>${token}</h1>
     <br><br><br>
     <p>Caso não tenha solicitado a redefinição de sua senha, por favor, ignore esse email</p>
     <br><br><br>
     <h3>Atenciosamente,</h3>
     <h4>Equipe Fin.app,</h4>
    `;

    const result = emailProvider.sendEmail(
      name,
      email,
      subject,
      TextPart,
      HTMLPart
    );

    return result;
  } catch (error) {
    return error;
  }
};
