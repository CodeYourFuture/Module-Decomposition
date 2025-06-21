class Person:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

def is_adult(person: Person) -> bool:
    return person.age >= 18

# This attribute does not exist so it causes error
def print_hair_color(person: Person) -> None:
    print(person.hair_color)  
