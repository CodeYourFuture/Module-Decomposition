class Person:
    def __init__(self, name: str, age: int, preferred_operating_system: str):
        self.name = name
        self.age = age
        self.preferred_operating_system = preferred_operating_system

imran = Person("Imran", 22, "Ubuntu")
print(imran.name)
print(imran.address) # address is not an attribute of the Person class

eliza = Person("Eliza", 34, "Arch Linux")
print(eliza.name)
print(eliza.address)# address is not an attribute of the Person class