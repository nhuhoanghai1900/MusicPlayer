const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const dataPlaylist = $(".playlist")
const heading = $("header h3")
const cd = $(".cd")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const btnplay = $(".btn-toggle-play")
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const dashboard = $('.dashboard')
const toggleDarkMode = $(".dark-mode-toggle")
const searchInput = $("#search")
const listFavorite = $(".list-favorite")

const app = {
    songsIndex: 0,
    songs: [],
    isPlaying: true,
    isRandom: false,
    isRepeat: false,
    isHeart: false,
    favoritePlaylist: [],
    islistFavorite: false,
    shuffledSongs: [],
    getConfig: JSON.parse(localStorage.getItem('local_storage')) || {}, // Lấy dữ liệu từ localStorage
    setConfig: function (key, value) {
        this.getConfig[key] = value // Cập nhật dữ liệu
        localStorage.setItem('local_storage', JSON.stringify(this.getConfig)) // Lưu vào localStorage
    },

    // Lấy danh sách bài hát từ file database.json
    async fetchSongsData() {
        const res = await fetch('./database.json') // Fetch dữ liệu
        this.songs = await res.json()  // Gán dữ liệu vào mảng songs
        this.start()
    },

    // Hiển thị danh sách bài hát
    render: function (keyword = "", favoritePlaylist = this.songs) {
        const fvSongs = this.getConfig.fvSongs || {};
        const htmls = favoritePlaylist
            .filter(song =>
                song.name.toLowerCase().includes(keyword) ||
                song.singer.toLowerCase().includes(keyword))
            .map((song, index) => {
                const originalIndex = song.originalIndex !== undefined ? song.originalIndex : index;
                return `
          <div class="song ${originalIndex === this.songsIndex ? 'active' : ''}" data-index="${originalIndex}">
            <div class="thumb" style=" background-image: url('${song.image}');"></div>           
            <div class="body">
              <h2 class="title">${song.name}</h2>
              <p class="author">${song.singer}</p>
            </div>
            <i class="far fa-heart ${fvSongs[originalIndex] ? 'heart' : ''}"></i>
          </div>`
            })
        dataPlaylist.innerHTML = htmls.join("");
    },

    // Lấy bài hát hiện tại
    get getSongs() {
        return this.songs[this.songsIndex];
    },

    // Tải bài hát hiện tại
    loadSongs() {
        const { name, image, path } = this.getSongs;
        heading.textContent = name; // Cập nhật tiêu đề
        cdThumb.style.backgroundImage = `url('${image}')`; // Cập nhật ảnh
        audio.src = path; // Cập nhật nhạc
        app.render(); // Render danh sách
    },

    // Tải dữ liệu từ localStorage
    loadStorage: function () {
        app.isRandom = app.getConfig.isRandom
        app.isRepeat = app.getConfig.isRepeat
        this.fvSongs = this.getConfig.fvSongs || {}
    },

    // Chuyển bài hát tiếp theo
    nextSongs: function () {
        this.songsIndex++
        if (this.songsIndex >= this.songs.length) {
            this.songsIndex = 0
        }
        this.loadSongs()
        this.scrollToActive()
    },

    // Quay lại bài hát trước
    prevSongs: function () {
        this.songsIndex--
        if (this.songsIndex < 0) {
            this.songsIndex = this.songs.length - 1
        }
        this.loadSongs()
        this.scrollToActive()
    },

    // Phát bài hát ngẫu nhiên
    randomSongs: function () {
        if (!this.shuffledSongs || this.shuffledSongs.length === 0) {
            this.shuffledSongs = [...this.songs]
        }
        let newSongsIndex
        do {
            newSongsIndex = Math.floor(Math.random() * this.shuffledSongs.length)
        } while (newSongsIndex === this.songsIndex);

        this.songsIndex = this.songs.findIndex(song => song === this.shuffledSongs[newSongsIndex])
        this.shuffledSongs.splice(newSongsIndex, 1)

        app.loadSongs()
    },

    // Cuộn đến bài hát đang phát
    scrollToActive: function () {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    },

    // Cập nhật danh sách yêu thích
    updateFavoritePlaylist: function () {
        const fvSongs = this.getConfig.fvSongs || {};
        this.favoritePlaylist = this.songs
            .map((song, index) => ({ ...song, originalIndex: index }))
            .filter(song => fvSongs[song.originalIndex]);
    },

    // Xử lý các sự kiện
    hendleEvents: function () {
        // Thu nhỏ ảnh CD khi cuộn
        const newCd = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const setWidth = newCd - scrollTop;

            let newMarginTop = setWidth > 0 ? '15px' : 0
            dashboard.style.marginTop = newMarginTop;

            cd.style.width = setWidth > 0 ? setWidth + "px" : "0px";
            cd.style.opacity = setWidth / newCd;
        }

        // Xử lý play/pause
        btnplay.onclick = () => btnplay.isPlaying ? audio.pause() : audio.play()

        // Khi nhạc phát
        audio.onplay = function () {
            btnplay.isPlaying = true
            $(".player").classList.add("playing");
            cdThumbAnimate.play()
        }

        // Khi nhạc dừng
        audio.onpause = function () {
            btnplay.isPlaying = false
            $(".player").classList.remove("playing");
            cdThumbAnimate.pause()
        }

        // Cập nhật thanh tiến trình
        audio.ontimeupdate = function () {
            if (this.duration && !isNaN(this.duration)) {
                const progressPercent = (this.currentTime / this.duration) * 100
                progress.value = progressPercent || 0
            }
        }

        // Tua nhạc
        progress.oninput = function (e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }

        // Xoay ảnh CD
        const cdThumbAnimate = cdThumb.animate(
            { transform: 'rotate(360deg)' },
            { duration: 5000, iterations: Infinity })
        cdThumbAnimate.pause()

        // Chuyển bài tiếp theo
        btnNext.onclick = () => (app.isRandom ? app.randomSongs() : app.nextSongs(), audio.play())

        // Quay lại bài trước
        btnPrev.onclick = () => (app.isRandom ? app.randomSongs() : app.prevSongs(), audio.play())

        // Bật/tắt phát ngẫu nhiên
        btnRandom.onclick = function () {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            this.classList.toggle('active', app.isRandom)
        }

        // Bật/tắt lặp lại bài hát
        btnRepeat.onclick = function () {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            this.classList.toggle('active', app.isRepeat)
        }

        // Khi bài hát kết thúc
        audio.onended = () => (app.isRepeat ? audio.play() : btnNext.click())

        // Xử lý khi click vào bài hát
        dataPlaylist.onclick = function (e) {
            const fvSongs = app.getConfig.fvSongs || {};

            const songNode = e.target.closest('.song:not(.active)')
            const btnFavorite = e.target.closest('.fa-heart')
            if (songNode) {
                app.songsIndex = Number(songNode.dataset.index)
                app.loadSongs()
                audio.play()
            }
            if (btnFavorite) {
                const fvIndex = Number(btnFavorite.closest('.song').dataset.index)
                let fvSongs = app.getConfig.fvSongs || {};
                fvSongs[fvIndex] = !fvSongs[fvIndex];
                app.setConfig('fvSongs', fvSongs);
                btnFavorite.classList.toggle('heart', fvSongs[fvIndex]);
            }
            app.updateFavoritePlaylist()
            app.render("", app.islistFavorite ? app.favoritePlaylist : app.songs)
        }

        // Chuyển chế độ tối
        toggleDarkMode.onclick = function () {
            document.body.classList.toggle('dark-mode')
        }

        // Tìm kiếm bài hát
        searchInput.oninput = function () {
            const keyword = this.value.toLowerCase().trim()
            app.render(keyword)
        }

        // Hiển thị danh sách yêu thích
        listFavorite.onclick = function () {
            app.islistFavorite = !app.islistFavorite
            const a = JSON.parse(localStorage.getItem('local_storage')) || {}
            const b = a.fvSongs || {}

            app.updateFavoritePlaylist()
            app.render("", app.islistFavorite ? app.favoritePlaylist : app.songs)
        }

    },
    start: function () {
        this.loadStorage();
        this.render();
        this.loadSongs();
        this.hendleEvents();

        btnRandom.classList.toggle('active', app.isRandom)
        btnRepeat.classList.toggle('active', app.isRepeat)
    },
};
app.fetchSongsData();
