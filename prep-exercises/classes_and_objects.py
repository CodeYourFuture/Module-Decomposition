class Person:
    def __init__(self, name: str, age: int, preferred_operating_system: str):
        self.name = name
        self.age = age
        self.preferred_operating_system = preferred_operating_system

    def is_adult(self) -> bool:
        return self.age >= 18


imran = Person("Imran", 22, "Ubuntu")
print(imran.name)
# print(imran.address)  # Error: address is not an attribute
print(imran.is_adult())

eliza = Person("Eliza", 34, "Arch Linux")
print(eliza.name)
# print(eliza.address)  # Error: address is not an attribute


# This function will error at runtime if called
def get_address(person: Person) -> str:
    return person.address  # Error: Person has no attribute 'address'

# print(get_address(imran))  # Uncommenting this will cause an error
