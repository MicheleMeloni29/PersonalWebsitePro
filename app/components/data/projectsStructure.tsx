//This file have the structure of the projects

export interface ProjectImage {
    type?: 'image' | 'video';
    src: string
}

export interface Project {
    title: string;                          // Title of the project
    short: string;                          // Short description
    full: string;                           // Full description (user can use markdown)
    images: (string | ProjectImage)[];      // Array of image URLs or ProjectImage objects
}


export const projects: Project[] = [
    {
        title: 'Orto Verde',
        short: 'Project carried out in a team with two colleagues to complete the practical part of the course "Human-machine interaction"',
        full: 'We had the task of designing and creating an android application using the Java language. So we decided to create an application that would allow users to organize their own small vegetable garden at home and keep it under control even remotely with various humidity sensors and remote irrigation device. The login is managed so that every time the user wants to log in, he must first register by filling in the mandatory fields. Once the data is stored, the user can log in. The home page shows the user the state of the sensors and the possibility to irrigate the garden. The application also allows you to add new plants, view the history of irrigation and sensor data, and receive notifications when the plants need attention. The project was a great opportunity to apply our knowledge of Java and Android development, as well as to work collaboratively in a team.',
        images: ['/IlMioOrto/Start.png',
            '/IlMioOrto/Login.png',
            '/IlMioOrto/Signin.png',
            '/IlMioOrto/Home.png'],
    },
    {
        title: 'Frogger',
        short: 'Video game created in C with lncurses library for the course "Operative Systems" with a colleague',
        full: 'This is a video game created in C using the lncurses library, which allows for the creation of text-based user interfaces. The game is inspired by the classic Frogger game, where the player must navigate a frog across a busy road and a river filled with obstacles. The player controls the frog using the arrow keys to move up, down, left, or right. The goal is to reach the other side of the screen without getting hit by cars or falling into the water. The game features a simple scoring system, where the player earns points for successfully crossing the road and river. The game ends when the player either reaches the goal or loses all their lives.',
        images: [
            { type: 'video', src: '/Frogger/Video.mp4' },
        ],
    },
    {
        title: 'WeatherApp',
        short: 'App developed in React Native and tested with Expo on local weather forecasts and added locations',
        full: " I developed this app with the goal of getting started with API calls and geolocation. So I created this app that lets you view weather forecasts(using APIs provided by openWeatherMap). Users can register, which will log them into the database and then log in and open their own session, which will store their settings and the locations they've chosen for the forecast. By default, you always have the weather forecast card for the device's current location. If you want to see weather forecasts for other locations, you can use the dedicated screen to search for the location of your choice or search for it on the maps and insert it.You will then have a new card on the home screen with a new location and its weather forecast.",
        images: [
            'WeatherApp/welcomeLight.png',
            'WeatherApp/welcomeUncompleteLight.png',
            'WeatherApp/welcomeDark.png',
            'WeatherApp/registerEmptyLight.png',
            'WeatherApp/regiterErrorLight.png',
            'WeatherApp/registerLightOk.png',
            'WeatherApp/registerDark.png',
            'WeatherApp/homeLight.png',
            'WeatherApp/homeLight+.png',
            'WeatherApp/homeDark.png',
            'WeatherApp/addLocationLight1.png',
            'WeatherApp/addLocationLight2.png',
            'WeatherApp/addLocationLight3.png',
            'WeatherApp/addLocationDark.png',
            'WeatherApp/settingsLight.png',
            'WeatherApp/settingsDark.png',
        ]
    },
    {
        title: 'Serie A Escange',
        short: 'Another app developed in React Native and tested with Expo, but with backend full developed by me with python and django',
        full: "PROJECT STILL IN DEVELOPMENT!!! After understanding ReactNative and starting to see some backend potential, I decided to develop my own backend for this project using Python(Django). It's an app that allows users to earn game credits through quizzes or other methods I'll implement later.These credits can then be used to purchase card packs. These cards can only be collected for now, but I'm working on other app implementations, such as card trading between users or even card games where users challenge each other with their own cards. See app dimotration video: https://www.youtube.com/watch?v=UFcIKJ8q8GY",
        images: [
        ],
    },
];