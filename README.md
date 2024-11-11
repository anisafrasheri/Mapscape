# Mapscape
A project created for Google Photorealistic 3D Maps Challenge

## Inspiration
As two girls who love nature, walking, and biking in the park, we understand firsthand the importance of trees and green spaces. We’ve always felt connected to the environment, and seeing the effects of climate change—such as deforestation and the loss of these natural havens—truly alarmed us. The declining state of our forests inspired us to take action. We wanted to create a platform where others who share our passion for nature can contribute to reforestation, helping to restore the environment one tree at a time. **Mapscape** is our way of fighting back against climate change and spreading awareness about the crucial role trees play in our lives.

## What it does
**Mapscape** allows users to:
- **Donate to plant trees** in deforested regions.
- **Select where they want trees to be planted** by placing markers on a map integrated with the Google Maps API.
- **Preview in planted trees** in Photorealistic 3D.
- **Learn about forestation and deforestation** trends globally, with educational resources on the environmental impact of trees and forests.

The goal is to make tree planting a more personal, interactive, and informed decision for users while raising awareness about deforestation.

## How we built it
1. **Frontend (HTML, CSS, JavaScript):**
   - We built the user interface using HTML and CSS to ensure a clean, intuitive design.
   - JavaScript was used for interactions, allowing users to place tree markers on the Google Maps interface.
   
2. **Google Maps API Integration:**
   - Google Maps API was implemented to allow users to view a map and suggest locations for tree planting by dropping markers.

   - We used location data to store user-suggested tree planting sites in a database.

3. **Backend:**
   - We created endpoints to manage donations, user data, and interaction with the Google Maps API.
   - Using MySQL to store the data.

4. **Educational Content:**
   - We added an educational section where users can learn about the benefits of reforestation, current deforestation issues, and how their contributions make an impact. This section was built with HTML, CSS, and populated dynamically using JavaScript.

## Challenges we ran into
1. **Handling User Input on Google Maps:**
   - It was challenging to accurately record and store user-suggested tree planting locations using the Google Maps API. We faced issues with marker persistence but solved them by refining the marker storage and retrieval process from the database.

2. **Integrating the Donation System:**
   - Setting up a secure, seamless donation system took longer than expected. We needed to ensure the payment gateway was secure and aligned with user privacy and payment regulations.

3. **Optimizing Performance:**
   - Ensuring the smooth interaction between the map, donation system, and educational content required optimization. We spent time refining code to minimize loading times and improve the overall user experience.

## Accomplishments that we're proud of
- Successfully integrating Google Maps API to allow users to place markers and suggest tree planting locations.
- Creating a seamless and secure donation process that allows users to contribute to reforestation efforts.
- Developing an educational platform that provides valuable knowledge about deforestation and its environmental impact.
- Building a platform that connects users with environmental action in a meaningful, interactive way.

## What we learned
- We learned a lot about **working with Google Maps API**, especially in terms of user interactions like placing markers and saving location data.
- Implementing a **donation system** and ensuring secure transactions was an important learning curve.
- We gained more insight into the **impact of deforestation**, which motivated us further to make this platform engaging and educational.
- From a technical perspective, we learned to optimize performance for a multi-feature application to provide a smooth user experience.

## What's next for Bloom and Stella planting trees
- **Mobile App Development**: We aim to develop a mobile app version of **Bloom and Stella** to make it even easier for users to plant trees and track their impact on the go.
- **Partnerships**: We're looking to collaborate with environmental NGOs and tree-planting initiatives to maximize the real-world impact of our platform.
