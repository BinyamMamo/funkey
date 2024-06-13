import datetime
x = datetime.datetime.now()

y = datetime.datetime.strptime("00:00:27,800", "%X")
z = datetime.datetime.strptime("02:18:52", "%X")
d = z - y

print(d)
print(d.seconds * 1000)
# print(d.strftime("%X"))
