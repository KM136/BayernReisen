import axios from "axios";
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix : "_" })
const clientID = process.env.DB_CLIENT_ID
const apiKey = process.env.DB_API_KEY

export default async function getStations(offset: number) {

    const twoDigits = (s: string) => s.padStart(2, '0') 

    const date = new Date()
    const year = `${date.getFullYear()}`.slice(2)
    const month = twoDigits(`${date.getMonth() + 1}`)
    const day = twoDigits(`${date.getDate()}`)
    const hour = twoDigits(`${date.getHours() + offset}`)
    console.log(month, day, hour)

    try {
        const response = await axios.get(`https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/8000320/${year}${month}${day}/${hour}`, 
            {
                headers: {
                    'DB-Client-ID': clientID,
                    'DB-Api-Key': apiKey,
                    accept: 'application/xml'
                },
            })
            console.log('fetching data...')
            const {timetable: { s } } = parser.parse(response.data)

            const filteredData = s.filter( (el : { dp: { _ppth : string}, tl:{_c:string}}) => (
                el.dp?._ppth.includes("München Ost") 
                && el.tl._c !== "EC" 
                && el.tl._c !== "RJ"
                && el.tl._c !== "WB"
                && el.tl._c !== "NJ"))

            const sortedData = filteredData.sort(( a: {dp:{_pt: string}}, b: {dp:{_pt: string}} ) => +a.dp._pt - +b.dp._pt)
            // console.log(sortedData)
            return sortedData
        }
    catch (e: any) {
        console.error('ошибка запроса', e.message)
        return []
        }
}

// getStations()

