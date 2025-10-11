class Person:
    def __init__(self, name: str, age: int, preferred_operating_system: str):
        self.name = name
        self.age = age
        self.preferred_operating_system = preferred_operating_system

imran = Person("Imran", 22, "Ubuntu")
print(imran.name)
#when try to run this code says person don't have address attribute
#need to comment out to run code
#print(imran.address)

eliza = Person("Eliza", 34, "Arch Linux")
print(eliza.name)
#when try to run this code says person don't have address attribute 
#need to commentout to run code
#print(eliza.address)


def is_adult(person: Person) -> bool:
    return person.age >= 18

print(is_adult(imran))

#  error: "Person" has no attribute "surname"
def get_surname(person: Person) -> str:
    return person.surname

print(get_surname(eliza))