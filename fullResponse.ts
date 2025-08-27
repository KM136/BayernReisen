import getStations from './stations'

const fullResponse = async () => {
    const result: any[] = []
    try {
    for(let offset = 0; offset < 3; offset++){
        const data = await getStations(offset)
        result.push(...data)
    }
    console.log('result',result)
    return result
} catch (e:any){
    console.log(e.message)
    return []
}
}

// fullResponse()

export default fullResponse