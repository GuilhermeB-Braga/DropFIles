import QRCode from "qrcode"

export const generateQrBuffer = async (text) => {

    try {

        const buffer = await QRCode.toBuffer(text, {
            type: 'png',
            color: {
                dark: "#1d1d1d",
                light:"#e7e7e7"
            }
        })

        return buffer
        
    } catch (error) {

        console.log({message: "Falha ao gerar QR Code", error: error})
        
    }

}