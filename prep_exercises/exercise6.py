from dataclasses import dataclass
from typing import List
from datetime import date

@dataclass(frozen=True)
class Person:
    name: str
    birth_date: date
    children: List["Person"]

fatma = Person(name="Fatma", birth_date=date(2011, 5, 10), children=[])
aisha = Person(name="Aisha", birth_date=date(2015, 8, 22), children=[])

imran = Person(name="Imran", birth_date=date(2000, 3, 15), children=[fatma, aisha])

def current_age(birth_date: date) -> int:
    today = date.today()
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age

def print_family_tree(person: Person) -> None:
    print(f"{person.name} ({current_age(person.birth_date)})")
    for child in person.children:
        print(f"- {child.name} ({current_age(child.birth_date)})")

print_family_tree(imran)