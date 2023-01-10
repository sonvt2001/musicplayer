const audio = document.querySelector('#audio')
const playBtn = document.querySelector('.btn-toggle-play')
const player = document.querySelector('.player')
const cd = document.querySelector('.cd')
const headingName = document.querySelector('header h2')
const headingSinger = document.querySelector('header h4')
const cdThumb = document.querySelector('.cd-thumb')
const progress = document.querySelector('#progress')
const nextBtn = document.querySelector('.btn-next')
const prevBtn = document.querySelector('.btn-prev')
const randomBtn = document.querySelector('.btn-random')
const repeatBtn = document.querySelector('.btn-repeat')
const playList = document.querySelector('.playlist')

const STORAGE_KEY = 'MUSIC_SONW_PLAYER'

const app = {
    currentIndex : 3,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config))
    },
    songs : [
        {
            name: 'Anh sẽ về sớm thôi',
            singer: 'Isaac',
            path: 'song/Anh-Se-Ve-Som-Thoi-Isaac.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc Việt',
            path: 'song/Chay-Ve-Noi-Phia-Anh-Khac-Viet.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
        {
            name: 'Giá như',
            singer: 'Noo Phước Thịnh',
            path: 'song/Gia-Nhu-Noo-Phuoc-Thinh.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
        {
            name: 'Nàng thơ',
            singer: 'Hoàng Dũng',
            path: 'song/Nang-Tho-Hoang-Dung.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
        {
            name: 'Níu duyên không thành',
            singer: 'Hương LyLy',
            path: 'song/Niu-Duyen-Khong-Thanh-Huong-Ly-LY-M.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
        {
            name: 'Sau chia tay',
            singer: 'Phạm Hồng Phước',
            path: 'song/Sau-Chia-Tay-Pham-Hong-Phuoc.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
        {
            name: 'Tết đi lên cùng nhau',
            singer: 'Da LAB',
            path: 'song/Tet-Di-Len-Cung-Nhau-Da-LAB.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
        {
            name: 'Tết này con hứa về',
            singer: 'Đan Trường',
            path: 'song/Tet-Nay-Con-Hua-Ve-Dan-Truong.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
        {
            name: 'Trời như cơn mơ',
            singer: 'CHICHA22 Kim-Chi-Sun CHARLES',
            path: 'song/Troi-Nhu-Con-Mo-CHICHA22-Kim-Chi-Sun-CHARLES.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
        {
            name: 'Yêu em hơi sâu',
            singer: 'LK',
            path: 'song/Yeu-Em-Hoi-Sau-LK.mp3',
            img: 'img/302078983_1774942762859754_362515752595849225_n.jpg'
        },
    ],

    render : function(){
       const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
       })

       playList.innerHTML = htmls.join('')
    },

    defineProperties : function() {
        Object.defineProperty(this, 'currentSong', {
            get : function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents : function(){

        // handle cd animation

        const cdThumAnimate = cdThumb.animate([
            { transform: 'rotate(360deg'}
        ],{
            duration: 10000, //10s
            iterations: Infinity // vo han
        })

        cdThumAnimate.pause()

        const  _this = this
        // Handle Scroll 

        const cdWidth = cd.offsetWidth

        document.onscroll = function() {
            const scroll = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scroll
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 
            cd.style.opacity = newCdWidth / cdWidth
       }
       playBtn.onclick = function() {
           if(_this.isPlaying) {
                audio.pause()
           }
           else {
                audio.play()
            }
       }

       // Handle When Song Played

       audio.onplay = function() {
           _this.isPlaying = true
           player.classList.add('playing')
           cdThumAnimate.play()
       }
       audio.onpause = function() {
           _this.isPlaying = false
           player.classList.remove('playing')
           cdThumAnimate.pause()
       }

       // Change progress Time Song
       audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
       }

       // tua time song
       progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
       }

       //next song
       nextBtn.onclick = function(){
        if(_this.isRandom){
            _this.randomSong()
        }
        else{
            _this.nextSong()
        }
        audio.play()
        _this.render()
       }

       //prev song
       prevBtn.onclick = function(){
        if(_this.isRandom){
            _this.randomSong()
        }
        else{
            _this.prevSong()
        }
        audio.play()
        _this.render()
       }

       // random song
       randomBtn.onclick = function(){
        _this.isRandom = !_this.isRandom
        _this.setConfig('isRandom', _this.isRandom)
        randomBtn.classList.toggle('active', _this.isRandom)
       }

         //hande repeat song
       repeatBtn.onclick = function(){
        _this.isRepeat = !_this.isRepeat
        _this.setConfig('isRepeat', _this.isRepeat)
        repeatBtn.classList.toggle('active', _this.isRepeat)
       }

       //hande next song when song ended
       audio.onended = function(){
        if(_this.isRepeat){
            audio.play()
        }
        else{
            nextBtn.click()
        }
       }

       //click song into view
       playList.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)')
           if( songNode || e.target.closest('.option')) {
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.render()
                    _this.loadCurrentSong() 
                    audio.play()
                }
            }
       }
    },

    loadCurrentSong : function(){
        headingSinger.textContent = this.currentSong.singer
        headingName.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },

    nextSong : function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },

    prevSong : function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },

    randomSong : function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.songs.length)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    loadConfig : function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    start : function(){
        this.loadConfig()
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Load thông tin bài hát đầu tiền ra UI
        this.loadCurrentSong()

        // Render Playlist
        this.render()

        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    } 
}

app.start()