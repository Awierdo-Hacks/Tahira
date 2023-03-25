import requests
from bs4 import BeautifulSoup

url = "https://ecode.figlab.io/quick_list.html"

response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

table = soup.find('table')
rows = table.find_all('tr')

for row in rows:
    cols = row.find_all('td')
    if len(cols) == 3:
        ecode = cols[0].text.strip()
        name = cols[1].text.strip()
        status = cols[2].text.strip()

        if "HALAL" in status:
            halal = True
            print(ecode, name, "Halal")

        elif "HARAM" in status:
             print(ecode, name,  "Haram")
             haram = True
           
        else:
            print(ecode, name,"Mushbooh")
            mushbooh = True

