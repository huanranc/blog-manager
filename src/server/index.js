export async function postFetch (url, body) {
  try {
    let response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });
    let json = await response.json();
    return json;
  } catch (err) {
    console.log(err)
  }
}