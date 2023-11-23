import requests

basehost = "localhost"
baseport = "3000"
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

def register(eventName, endpoint):
    url = baseurl + "/webhook"

    data = {
        "eventName": eventName,
        "endpoint": endpoint,
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=data, headers=headers)
    return response

def book(acaraId, kursiId, userId):
    url = baseurl + "/api/book"

    data = {
        "acaraId": acaraId,
        "kursiId": kursiId,
        "userId": userId,
    }
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, json=data, headers=headers)
    return response

if __name__ == "__main__":
    response = test_webhook("/custom")
    # response = register("piss", "/custom")
    # response = book(1, 1, 1)

    print("\nstatus code:", response.status_code)
    print("Response content:")
    print(response.text)
