import requests
basehost = "localhost"
baseport = "3100"
baseurl = "http://" + basehost + ":" + baseport

rabbitmqHost = "localhost"
rabbitmqPort = 8200

def test_webhook(endpoint):
    url = baseurl + endpoint

    # data = {
    #     "email": email,
    #     "eventId": event_id,
    #     "ticketId": ticket_id
    # }
    # headers = {'Content-Type': 'application/json'}

    # response = requests.post(url, json=data, headers=headers)
    response = requests.post(url)
    return response

def register():
    url = baseurl + "/webhook/clients"

    response = requests.post(url)
    return response

def registerEndpoint(eventName, endpoint, token):
    url = baseurl + "/webhook"

    data = {
        "eventName": eventName,
        "endpoint": endpoint,
    }
    headers = {
        'Content-Type': 'application/json',
        'API-Key': token
        }

    response = requests.post(url, headers=headers, json=data)
    return response

def book(email, acaraId, kursiId, userId):
    url = baseurl + "/api/book"

    data = {
        "email": email,
        "acaraId": acaraId,
        "kursiId": kursiId,
        "userId": userId,
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=data, headers=headers)
    return response

def get():
    url = baseurl + "/api/kursi"

    response = requests.get(url)
    return response

if __name__ == "__main__":
    # response = register()
    # response = registerEndpoint("payment", "/euy2", "b0704a8f-ce53-4606-9f6e-0cb40f62dbb6")
    response = test_webhook("/webhook/payment")
    # response = book(1, 1, 1)

    print("\nstatus code:", response.status_code)
    print("Response content:")
    print(response.text)
