from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True)
class Person:
    name: str
    date_of_birth: date
    preferred_operating_system: str

def is_adult(self):
        today_date = date.today()
        birth_date= self.date_of_birth
        #to check date and month as well
        age = today_date.year-birth_date.year- ((today_date.month, today_date.day) < (birth_date.month, birth_date.day)) 
        return age>=18    

imran = Person("Imran", (1989,6,25), "Ubuntu")  # We can call this constructor - @dataclass generated it for us.
print(imran)  # Prints Person(name='Imran', date_of_birth=(1989, 6, 25), preferred_operating_system='Ubuntu')

imran2 = Person("Imran", (1989,6,25), "Ubuntu")
print(imran == imran2)  # Prints True