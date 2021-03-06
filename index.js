const pLimit = require('p-limit');
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
    if (data.links.next) {
        await getAllData(data.links.next, collector);
    }
    if(!data.links.next) console.log(`Collected ${collector.length} members`)
    return collector;
}

async function getMembersWithLanguages(memberList) {
    const membersWithLanguage = memberList.filter(member => {
        const languages = member.attributes.languages

        return languages && languages.length > 0
    })
    console.log(`Found ${membersWithLanguage.length} members with languages`)
    return membersWithLanguage
}

function createMemberUpdateRequests(memberList) {

    return memberList.map(member => {
        const languages = member.attributes.languages
        const tags = makeLanguageArray(languages)
        return {
            method: 'PUT',
            url: `https://app.orbit.love/api/v1/${process.env.WORKSPACE}/members/${member.id}`,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.API_KEY}`
            },
            data: {
                tags_to_add: tags
            }
        }
    })
    // console.log(requests)
}

function makeLanguageArray(languages) {
    return languages.map(language => `language:${language}`)
}

async function run() {
    // Sets the max concurrent limit for the requests
    const limit = pLimit(60);

    const members = await getAllData('https://app.orbit.love/api/v1/bryan-personal/members?affiliation=member&start_date=2022-01-01&items=100')

    const membersWithLanguage = await getMembersWithLanguages(members)

    const memberUpdateRequests = createMemberUpdateRequests(membersWithLanguage)

    let promises = memberUpdateRequests.map(request => limit(() => axios(request)));
    Promise.all(promises).then(axios.spread((...allData) => {
        console.log(`Updated ${allData.length} members`);
      }))

}



run()