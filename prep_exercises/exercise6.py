from dataclasses import dataclass
from typing import List
from datetime import date

@dataclass(frozen=True)
class Person:
    name: str
    age: int
    children: List["Person"]

fatma = Person(name="Fatma", birth_year=2011, children=[])
aisha = Person(name="Aisha", birth_year=2015, children=[])

imran = Person(name="Imran", birth_year=2000, children=[fatma, aisha])

def current_age(birth_year:int) -> int:
    today = date.today()
    return today.year - birth_year

def print_family_tree(person: Person) -> None:
    print(f"{person.name} ({current_age(person.birth_year)})")
    for child in person.children:
        print(f"- {child.name} ({current_age(child.birth_year)})")

print_family_tree(imran)