const AppMeteo = {
    props: {
        date: String,
        actualTemp: Number,
        tempMin: Number,
        tempMax: Number,
        windSpeed: Number,
        description: String,
        icon: String,
        realFeel: Number,
    },

    template : `

    <div class="container-meteo">
        <div class="container-meteo-actuel">
            <p><b>{{date}}</b></p>
            <img :src="'http://openweathermap.org/img/wn/' + icon + '@2x.png'">
            <p class="temperature">{{actualTemp.toFixed(0)}}°c <br/></p>
            <p class="p-description">{{description}}<br/></p>

        </div>

        <div class="container-meteo-info">
            <p>
                Temp min: {{tempMin.toFixed(0)}}°c <br/>
                Temp max: {{tempMax.toFixed(0)}}°c <br/>
                Ressenti: {{realFeel.toFixed(0)}}°c<br/>
                Vent: {{windSpeed}} km/h<br/>
            </p>
        </div>
    </div>
    `
}


const RootComponent = {
    data(){
        return{
            arrayTemp: [],
            city: "...",
        }
    },

    components: {
        "AppMeteo" : AppMeteo,
    },

    async mounted(){
        const url = "https://api.openweathermap.org/data/2.5/forecast?q=Nice,fr&appid=4b25e3d5b70aa89e0e587f001da60404&units=metric"
        const response = await fetch (url)
        const dataWeather = await response.json()

        this.arrayTemp = dataWeather.list
        this.city = dataWeather.city.name
        console.log(this.arrayTemp)
        console.log(this.city)
    },

    methods: {
        geoloc(){
            navigator.geolocation.getCurrentPosition(async(position)=>{
                const lat = position.coords.latitude
                const long = position.coords.longitude

                const response = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+ lat + "&lon=" + long + "&appid=4b25e3d5b70aa89e0e587f001da60404&units=metric")
                const dataWeather = await response.json()

                this.arrayTemp = dataWeather.list
                this.city = dataWeather.city.name
            })
        }
    },


    template: `
    <div class="title"><h1>METEO</h1></div>
    <div class="bloc-meteo">
        <div class="app-meteo">
            <div class="text-here">
                <p>{{city.toUpperCase()}}</p>
                <button @click="geoloc">cliquer pour me geolocaliser</button>
            </div>
            <AppMeteo
                v-for = "element in arrayTemp"
                :date = "element.dt_txt"
                :city = "city"
                :actualTemp = "element.main.temp"
                :tempMin = "element.main.temp_min"
                :tempMax = "element.main.temp_max"
                :windSpeed = "element.wind.speed"
                :description = "element.weather[0].main"
                :icon = "element.weather[0].icon"
                :realFeel = "element.main.feels_like"
            />
        </div>
    </div>
 `
}

Vue.createApp(RootComponent).mount("#root")