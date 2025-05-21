class Person:
    def __init__(self, name: str, age: int, preferred_operating_system: str):
        self.name = name
        self.age = age
        self.preferred_operating_system = preferred_operating_system

imran = Person("Imran", 22, "Ubuntu")
print(imran.name)
# print(imran.address)

eliza = Person("Eliza", 34, "Arch Linux")
print(eliza.name)
# print(eliza.address)

def is_adult(person: Person) -> bool:
    return person.age >= 18

print(is_adult(imran))

def get_surname(person: Person) -> str:
    return person.surname

print(get_surname(eliza))
