import re

with open('frontend/src/utils/imageMapping.js', 'r') as f:
    content = f.read()

# Add pizza4
content = content.replace('import pizza3 from "../assets/food/pizza/3.jpg"', 'import pizza3 from "../assets/food/pizza/3.jpg"\nimport pizza4 from "../assets/food/pizza/4.jpg"')
content = content.replace('pizza: [pizza1, pizza2, pizza3]', 'pizza: [pizza1, pizza2, pizza3, pizza4]')

# Add north4, north5
content = content.replace('import north3 from "../assets/food/north-indian/3.jpg"', 'import north3 from "../assets/food/north-indian/3.jpg"\nimport north4 from "../assets/food/north-indian/4.jpg"\nimport north5 from "../assets/food/north-indian/5.jpg"')
content = content.replace('north: [north1, north2, north3]', 'north: [north1, north2, north3, north4, north5]')

# Add desserts4
content = content.replace('import desserts3 from "../assets/food/desserts/3.jpg"', 'import desserts3 from "../assets/food/desserts/3.jpg"\nimport desserts4 from "../assets/food/desserts/4.jpg"')
content = content.replace('dessert: [desserts1, desserts2, desserts3]', 'dessert: [desserts1, desserts2, desserts3, desserts4]')

# Fix exact map
content = content.replace('"chicken pepperoni pizza": pizza3', '"chicken pepperoni pizza": pizza4')

with open('frontend/src/utils/imageMapping.js', 'w') as f:
    f.write(content)

