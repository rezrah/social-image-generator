export const generateImage = async (data: string, endpoint: string) => {
  // Form the request for sending data to the server.
  const options = {
    // The method is POST because we are sending data.
    method: "POST",
    // Tell the server we're sending JSON.
    headers: {
      "Content-Type": "application/json",
    },
    // Body of the request is the JSON data we created above.
    body: data,
  };

  const response = await fetch(endpoint, options);
  return response;
};
