from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True)
class Person:
    name: str
    date_of_birth: str
    preferred_operating_system: str

    def is_adult(self):
        today_date = date.today()
        birth_date = date.fromisoformat(self.date_of_birth)
        age = today_date.year - birth_date.year

        return age >= 18


imran = Person("Imran", "2019-10-18", "Ubuntu")

print(imran.is_adult())
