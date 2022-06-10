const axios = require('axios');
require('dotenv').config();

async function getAllData(url, collector = []) {
    let {data} = await axios(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.API_KEY}`
        }  
    })
    collector.push(...data.data);
    console.log(`done: `)
    // TODO: UNCOMMENT when ready for bulk 
    // if (data.links.next) {
    //     await getAllData(data.links.next, collector);
    // }

    return collector;
}

async function getMembersWithLanguages(memberList) {
    console.log(memberList[0].attributes.languages)
    const membersWithLanguage = memberList.filter(member => {
        const languages = member.attributes.languages

        return languages && languages.length > 0
    })

    return membersWithLanguage
}

function createMemberUpdateRequests(memberList) {
    // TODO: create list of requests to send to Orbit for each member
    // TODO: Use makeLanguageArray function to create an array of tags for each member
}

function makeLanguageArray(languages) {
    return languages.map(language => `language:${language}`)
}

async function run() {
    const members = await getAllData('https://app.orbit.love/api/v1/bryan-personal/members?affiliation=member&start_date=2022-01-01&items=100')

    const membersWithLanguage = await getMembersWithLanguages(members)
    // TODO: create list of requests to send to Orbit for each member
    // The list should have an array of tags built from the array of languages for each member


}



run()