class Person:
    def __init__(self, name: str, age: int, preferred_operating_system: str):
        self.name = name
        self.age = age
        self.preferred_operating_system = preferred_operating_system

imran = Person("Imran", 22, "Ubuntu")
print(imran.name)
print(imran.address)

eliza = Person("Eliza", 34, "Arch Linux")
print(eliza.name)
print(eliza.address)

#imran.address and eliza.address is not valid attribute
#error: "Person" has no attribute "address"


def is_adult(person: Person) -> bool:
    return person.age >= 18

print(is_adult(imran))
#ok

def get_city(person: Person) -> str:
    return person.city
#person has no attribute city.

#to run mypy   mypy ./***.py