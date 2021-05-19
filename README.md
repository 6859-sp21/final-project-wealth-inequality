# 6.859 Final Project: Wealth Inequality Simulator Documentation
### Paper Title: Understanding a Simple Model for Wealth Distribution: Market Capitalism Leads to High Inequalities
### Team Members: Raunak Chowdhuri and Anushree Chaudhuri
### Abstract

In this work, we present an innovative interactive article format with embedded wealth inequality simulations. We aim to make economic and mathematical models of wealth distributions more accessible to an average user, allowing policymakers and the public to understand how changing various parameters and policies can shift wealth inequality. Our simulation is based on the Yard Sale Model, which is in agreement with empirical data of an average error less than 0.16%. In every situation run in the simulation without a wealth tax—even with a low fraction transacted and a high level of “fairness”—the wealth distribution inevitably concentrates wealth in the top 5% bracket of the agents. The moment a wealth tax is implemented, the distribution shifts. It does not remove the existence of economic class differences, but ensures that no small segment of the population holds more than 50% of the total wealth. The implications of our work suggest that a wealth tax or other wealth redistribution policies are crucial to preventing the exacerbation of already high socioeconomic inequalities. 

### [Project/Paper Link](https://6859-sp21.github.io/final-project-wealth-inequality/)

### [Video Link](https://www.loom.com/share/43994bb0ce714d3e82579d229fa6a919)

## Background 

Our team chose to focus on wealth inequality based on our common interests in social impact and topics that affect people around the world. Thus, every decision in our design process was guided by a desire to leave an impact and strong impression on the average user audience of our tool without being overwhelming or overly complex. 

Both of us are really passionate about social issues, and wealth inequality is one of the biggest issues in developed nations. We’ve read a lot of papers by famous economists that propose wealth redistribution policies like a wealth tax as a solution. However, many of the models used in these papers are locked in an ivory tower and it can be difficult for policymakers and the general population to make the jump between the problem of wealth inequality and the solution of a wealth tax without an interactive way to understand the models behind these conclusions. Our vision for this project was to take an experimental approach to the 6.859 project requirements by creating a paper in the Distill.pub format, which includes our interactive simulations within the article itself. We used the World Wealth and Income Database for exploratory analysis and some of the figures in our paper, and our simulation is based on the Extended Yard Sale Model, which completes agent to agent asset transaction over many iterations to model wealth distributions over time. 

As we did exploratory analysis and literature review using online databases and papers, we realized that the existing models are rarely presented interactively, and graphs of income inequality convince us of the problem but not of the solution. This is why our guiding values in all of our design decisions are accessibility and transparency. This influenced our choice to explore the Distill.pub format to create both a paper and simulation that is as accessible as possible and has a logical flow. We also ensured that every simulation would have every single parameter of the model as a factor that the user can control, giving full transparency to every part of the model and avoiding any hidden influences on results.

## Design Decisions

We took an experimental approach to this project, combining both the interactive data visualization and paper components in a format that would be accessible to academics, policymakers, and the general public. Using the interactive article format of Distill.pub, which is normally used for machine learning research, we embedded interactive visualizations into the paper that simulate the mathematical models used to predict wealth distribution outcomes. This retains a more academic format for economists and researchers, while allowing policymakers and general users to interact with and understand the model even without a mathematical or economic background. Our guiding values in the work of transparency and accessibility are emphasized by catering to a diverse range of audiences and reducing jargon as much as possible. Our hope is that this interactive paper format will help a broad table of stakeholders make better informed policy decisions when deciding how to reduce economic inequalities in society.

For the first interactive graph, we wanted to give the user a way to easily interact with the graph without making it an overwhelming focus of the paper. We used Plotly Express, a Python tool, to generate a graph of U.S. income quintiles. It allows users to filter between labels, zoom into different years, hover to see tooltip information, and change the time range and frequency. The colors are meant to be relatively muted, as this graph is part of the background and introduction of our topic and not meant to be the main focus of the paper. 

Similarly, for our second graph, we wanted to highlight the trends of Gini indices in different countries without including a large portion of the paper explaining these patterns. The interactive graph provides a great opportunity to make the information we briefly mention in the text accessible to a reader who is interested in comparing trends across countries, but also easy to glance over if the user is not interested. It also allows for filtering, hovering, zooming, panning, and range-selecting, giving the user a similar set of interactive tools as the last visualization. Again, these graphs are not a focus of the paper and are meant to be for the user's additional interest. 

For the agent-to-agent transaction simulator, we wanted to ensure that the design and layout were simple and clean as to not be confusing to an unacquainted user. Thus, the colors are kept grayscale and there are only two agents in the transaction to simplify the simulation as much as possible. We bring the equations mentioned in the paper to life as the user watches the transaction between two agents unfold in real-time. As they adjust the parameters dynamically and observe the resulting effects on agents' wealth, they should be well-equipped with the understanding to tackle the next interactive simulation of an entire economy of agents.

In the transaction simulations with and without the wealth tax, we continue the muted grayscale theme from the previous visualization, but we wanted to add a simple color gradient to demonstrate the concentration of wealth in specific brackets of the population. We went through several iterations of color schemes to understand what would have the most appropriate effect on the reader. Cooler colors like blue and purple suggested a sense of sadness or hopelessness to the viewer, while red and green seemed bold or optimistic. We ended up going with yellow, which connotates wealth (gold) and also brings a sense of attention and alarm to the highly concentrated wealth of the top 5% that results from not having a wealth tax. The shift between policies is much clearer by using the colors here. Finally, we use dynamic scaling and sliders so the user can adjust all the parameters while the simulation is running and observe how it changes the distribution.  

We didn't include uncertainties on any of the visualizations because of the reasons cited in the [paper](https://ieeexplore.ieee.org/document/8805422) we read in class. However, for a visualization aimed at a different audience or for a more analytical purpose, visualizing uncertainty would definitely be important in order to avoid misleading any viewers. 

## Development Process

We used Todoist, Google Calendar, and Google Drive to organize task allocation, meeting minutes, and project management throughout the process. This helped us keep track of where we were based on the upcoming deadlines. Since we are living in the same on-campus dorm and in the same undergraduate pod, we were able to complete a lot of the coding through in-person pair programming. This was a really unique experience and helped us learn how to collaborate better and learn from each other's strengths. In general, Raunak focused his efforts on the interactive visualization components of the project, while Anushree focused on the paper-writing, research, and project management aspects of the work. 

Generating each interactive visualization, polishing after receiving peer feedback, and working together in person probably took the longest amount of time. **Overall, we split up tasks evenly, and we both contributed equally to the final product, working 132 people-hours total or about 66 hours per person.** It was great to work with each other and we were able to put together a visualization we're both really excited about. We hope you enjoy it too!

## Technical Sources

#### Main Dataset

[World Bank Poverty and Equity Database, 2018](https://datacatalog.worldbank.org/dataset/poverty-and-equity-database)

#### Visualization Inspiration

[Our World in Data](https://ourworldindata.org/income-inequality)

[Extreme Wealth Inequality is Inevitable in a Free Market](https://medium.com/swlh/extreme-wealth-inequality-is-inevitable-in-a-free-market-it-can-be-numerically-proved-but-there-e1b5eada0dca#:~:text=left%20this%20month.-,Extreme%20wealth%20inequality%20is%20inevitable%20in%20a%20free%20market%3A%20numbers,but%20we%20can%20fix%20it&text=The%20%E2%80%9Cmeritocracy%E2%80%9D%20dogma%20states%20instead,he%2Fshe%20has%20worked%20for.)

#### Article Template

[Distill.pub](https://distill.pub/guide/)

