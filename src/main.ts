import Express, { Request, Response } from 'express'
import formidable from 'formidable'
import { createServer } from 'http'
import multer from 'multer'
import xlsx from 'xlsx'

const upload = multer({ storage: multer.memoryStorage() })
const PORT = +(process.env.PORT || 2560)
const application = Express()

application.post('/multer/files', upload.array('upload'), (request: Request, response: Response) => {
    const { files } = request
    for (const file of Object.values(files)) {
        const workbook = xlsx.read(file.buffer)
        console.log(workbook.Sheets)
    }
    response.send('OK')
})

application.post('/formidable/files', (request: Request, response: Response) => {
    const form = new formidable.IncomingForm();

    form.parse(request, (error, _fields, files) => {
        if (error) throw error
        for (const file of Object.values(files)) {
            const workbook = xlsx.readFile((file as formidable.File).path)
            console.log(workbook.Sheets)
        }
    })

    response.send('OK')

})

const bootstrap = async () => {
    const server = createServer(application)
    server.listen(PORT, () => console.log(`Running server in port ${PORT}`))
}

bootstrap()