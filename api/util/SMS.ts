import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
// import env from "dotenv";

// env.config();

export async function sendOTP(phoneNumber: string, otp: string) {
    const snsClient = new SNSClient({
        region: "eu-central-1",
    });

  const message = `${otp} is your verification code.`;

    const params = {
        Message: message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                DataType: 'String',
                StringValue: "HUUSH"
            },
            'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: 'Transactional' 
            }
        }
    };

    const command = new PublishCommand(params);

    try {
        const data = await snsClient.send(command);
        // console.log("Success", data);
    } catch (err) {
        // Error handling
        console.error(err);
    }
}

// const pn = "+48512658925"; 
// const otp = "123456";
// sendOTP(pn, otp);
