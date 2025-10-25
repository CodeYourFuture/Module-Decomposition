from dataclasses import dataclass
from typing import List

@dataclass(frozen=True)
class Person:
    name: str
    age: int
    children: List["Person"]

sara = Person(name="Sara", age=5, children=[])
ahmed = Person(name="Ahmed", age=8, children=[])

ali = Person(name="Ali", age=28, children=[sara])
aya = Person(name="Aya", age=32, children=[ahmed])

imran = Person(name="Imran", age=55, children=[ali, aya])

def print_family_tree(person: Person) -> None:
    print(f"{person.name} ({person.age})")
    for child in person.children:
        print(f"  - {child.name} ({child.age})")
        for grandchild in child.children:
            print(f"    - {grandchild.name} ({grandchild.age})")

def count_family_members(person: Person) -> int:
    count = 1
    for child in person.children:
        count += count_family_members(child)
    return count

print_family_tree(imran)
print(f"\nTotal family members: {count_family_members(imran)}")
