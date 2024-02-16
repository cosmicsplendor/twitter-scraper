const vSplitPoint = "?variables="

const parseParams = encodedJson => {
    const decodedJson = decodeURIComponent(encodedJson)
    const json = JSON.parse(decodedJson)
    return json
}
const parseVariables = input => {
    const url = decodeURI(input)
    const queryParams = url.split("?variables=")[1]
    const [ variablesStr, featuresStr ] = queryParams.split("&features=")

    return {
        variables: parseParams(variablesStr),
        features: parseParams(featuresStr)
    }
}

const serializeParam = obj => {
    const jsonString = JSON.stringify(obj)
    const encodedJson = encodeURIComponent(jsonString)
    return encodedJson
}
const generateUrl = (baseUrl, variables, features) => {
    const vParam = serializeParam(variables)
    const fParam = features ? serializeParam(features): ""
    const rawUrl = baseUrl + "?variables=" + vParam + (fParam ? "&features=" + fParam: "")
    const url = encodeURI(rawUrl).replace(/%25/g, "%")
    return url
}

const retrieveDataFromJson = json => {
    try {
        const instructions = json.data.user.result.timeline.timeline.instructions
        const terminate = Boolean(instructions[0] && instructions[0].type === "TimelineTerminateTimeline")
        const clearCache = Boolean(instructions[0] && instructions[0].type === "TimelineClearCache")
        const entriesIterator = terminate ? 
                                    instructions[1].entries: 
                                    clearCache ? 
                                        instructions[3].entries:
                                        instructions.entries()
        const data = { profiles: [], cursor: null, terminate }
        const addEntries = entries => {
            entries.forEach(entry => {
                try {
                    const profileData = entry.content.itemContent.user_results.result.legacy
                    profileData && data.profiles.push(profileData)
                } catch { }
            })
        }
        if (terminate) {
            addEntries(entriesIterator)
            return data
        }

        const processEntries = entries => {
            try {
                addEntries(entries)
                const bottomCursor = entries.find(cursor => cursor && cursor.content && cursor.content.cursorType === "Bottom")
                const cursorValue = bottomCursor.content.value
                data.cursor = cursorValue
            } catch (e) {
                console.log(e.message)
                return data
            }
        }
        if (clearCache) {
            processEntries(entriesIterator)
            return data
        }
        for (const rawEntries of entriesIterator) {
            const entries = rawEntries[1].entries
            processEntries(entries)
        }
        return data
    } catch(e) {
        console.log(e.message)
    }
}

module.exports = {
    vSplitPoint,
    parseVariables,
    retrieveDataFromJson,
    generateUrl
}