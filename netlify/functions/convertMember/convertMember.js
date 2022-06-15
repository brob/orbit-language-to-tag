const axios = require('axios')
require('dotenv').config()

function getId (event) {
  const body = JSON.parse(event.body)
  const data = body.event_payload.data;
  const memberId = data.attributes.id;
  return memberId
}
function makeLanguageArray(languages) {
  return languages.map(language => `language:${language}`)
}
const handler = async (event) => {
  try {
    const memberId = getId(event)
    console.log(memberId)

    const response = await axios.get(`https://app.orbit.love/api/v1/${process.env.WORKSPACE}/members/${memberId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + process.env.API_KEY
      }
    })
    const member = response.data.data

    const languages = member.attributes.languages

    const tags = makeLanguageArray(languages)
    console.log({tags})
    const request = {
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
    const putMember = await axios(request)
    console.log(putMember)
    return {
      statusCode: 200,
      body: `{ message: 'Success' }`,
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    console.log(error)
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
