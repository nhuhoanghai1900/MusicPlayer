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
/**
 * Ứng dụng phát nhạc với các chức năng:
 * - Lấy dữ liệu bài hát từ file JSON.
 * - Hiển thị danh sách bài hát và tìm kiếm theo từ khóa.
 * - Phát, tạm dừng, tua bài hát, và cập nhật giao diện.
 * - Chuyển bài hát tiếp theo, bài hát trước đó.
 * - Phát ngẫu nhiên và lặp lại bài hát.
 * - Chuyển đổi chế độ tối và yêu thích bài hát.
 * 
 * Các phương thức chính:
 * - `fetchSongsData()`: Lấy dữ liệu bài hát từ file `database.json`.
 * - `render(keyword)`: Hiển thị danh sách bài hát, có thể lọc theo từ khóa.
 * - `defineProperties()`: Định nghĩa thuộc tính để lấy bài hát hiện tại.
 * - `loadSongs()`: Tải dữ liệu bài hát hiện tại lên giao diện.
 * - `nextSongs()`: Chuyển đến bài hát tiếp theo.
 * - `prevSongs()`: Quay lại bài hát trước đó.
 * - `randomSongs()`: Phát bài hát ngẫu nhiên, tránh lặp lại.
 * - `scrollToActive()`: Cuộn đến bài hát đang phát.
 * - `hendleEvents()`: Xử lý các sự kiện giao diện như play, pause, tua, chuyển bài, tìm kiếm, v.v.
 * - `start()`: Khởi động ứng dụng, gọi các phương thức cần thiết.
 * 
 * Thuộc tính:
 * - `songsIndex`: Vị trí bài hát hiện tại trong danh sách.
 * - `isPlaying`: Trạng thái phát nhạc (true/false).
 * - `isRandom`: Trạng thái phát ngẫu nhiên (true/false).
 * - `isRepeat`: Trạng thái lặp lại bài hát (true/false).
 * - `shuffledSongs`: Danh sách bài hát xáo trộn.
 * - `songs`: Danh sách bài hát (data chính).
 */
const app = {
    songsIndex: 0,
    songs: [],
    isPlaying: true,
    isRandom: false,
    isRepeat: false,
    shuffledSongs: [],
    getConfig: JSON.parse(localStorage.getItem('local_storage')) || {},
    setConfig: function (key, value) {
        this.getConfig[key] = value
        localStorage.setItem('local_storage', JSON.stringify(this.getConfig))
    },

    // lấy dữ liệu bài hát từ file database.json
    async fetchSongsData() {
        const res = await fetch('./database.json') // Gửi yêu cầu fetch đến file database.json
        this.songs = await res.json()  // Chuyển đổi dữ liệu nhận được thành JSON và gán vào mảng songs
        this.start()
    },

    //---------- 0. Trả về dữ liệu mới theo mảng songs
    render: function (keyword = "") { //
        const htmls = this.songs
            // Lọc danh sách theo tên bài hát hoặc ca sĩ
            .filter(song =>
                song.name.toLowerCase().includes(keyword) ||
                song.singer.toLowerCase().includes(keyword))
            // Duyệt qua từng song trong mảng songs => trả về giá trị mới.
            .map((song, index) => {
                return `
          <div class="song ${index === this.songsIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style=" background-image: url('${song.image}');"></div>           
            <div class="body">
              <h2 class="title">${song.name}</h2>
              <p class="author">${song.singer}</p>
            </div>
            <i class="far fa-heart"></i>
          </div>`
            })
        dataPlaylist.innerHTML = htmls.join("");
    },

    //--------------- 1. Định nghĩa thuộc tính để lấy dữ liệu bài hát
    defineProperties: function () {
        // Sử dụng Object.defineProperty để thêm hoặc chỉnh sửa một thuộc tính
        Object.defineProperty(this, "getSongs", {
            // Getter để đọc và lấy dữ liệu bài hát hiện tại
            get: function () {
                return this.songs[this.songsIndex]; // Trả về bài hát có index 'songsIndex' trong songs
            },
        });
    },

    //------------------------- 2. Tải dữ liệu bài hát hiện tại lên giao diện
    loadSongs: function () {
        heading.textContent = this.getSongs.name; // Cập nhật tiêu đề bài hát
        cdThumb.style.backgroundImage = `url('${this.getSongs.image}')`; // Cập nhật img bài hát
        audio.src = this.getSongs.path; // Cập nhật file nhạc
        app.render() // Render lại danh sách bài hát sau khi tải dữ liệu
    },


    //local_storage
    loadStorage: function () {
        app.isRandom = app.getConfig.isRandom
        app.isRepeat = app.getConfig.isRepeat
    },

    //------------------------- Next nhạc
    nextSongs: function () {
        this.songsIndex++
        if (this.songsIndex >= this.songs.length) {
            this.songsIndex = 0
        }
        this.loadSongs()
        this.scrollToActive()
    },

    //------------------------- Prev nhạc
    prevSongs: function () {
        this.songsIndex--
        if (this.songsIndex < 0) {
            this.songsIndex = this.songs.length - 1
        }
        this.loadSongs()
        this.scrollToActive()
    },

    //------------------------- Random nhạc (tránh lặp index song nhiều lần trong 1 playlist)
    randomSongs: function () {
        //nếu shuffledSongs chưa có playlist hoặc có rồi nhưng hết 'song' thì làm mới playlist
        if (!this.shuffledSongs || this.shuffledSongs.length === 0) {
            this.shuffledSongs = [...this.songs]
        }
        //tạo mới + ngẫu nhiên giá trị index trong mảng shuffledSongs
        let newSongsIndex
        do {
            newSongsIndex = Math.floor(Math.random() * this.shuffledSongs.length)
        } while (newSongsIndex === this.songsIndex); // nếu điều kiện đúng tiếp tục lặp

        // trả về index mới nếu newSongsIndex có trong mảng data 'songs'
        this.songsIndex = this.songs.findIndex(index => index === this.shuffledSongs[newSongsIndex])
        //sau khi gán cho this.songsIndex  => xóa đi newSongsIndex đã random trong this.shuffledSongs
        this.shuffledSongs.splice(newSongsIndex, 1)

        app.loadSongs()
    },

    scrollToActive: function () {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    },

    //------------------------- Event Handles ----------------------------------------
    hendleEvents: function () {
        //zoom cd-thuhmb
        const newCd = cd.offsetWidth; // get width value
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const setWidth = newCd - scrollTop;
            let marginTop = dashboard.style.marginTop;

            let newMarginTop = setWidth > 0 ? '15px' : 0
            dashboard.style.marginTop = newMarginTop;

            cd.style.width = setWidth > 0 ? setWidth + "px" : "0px";
            cd.style.opacity = setWidth / newCd;
        }

        //lắng nghe và xử lý play + pause
        btnplay.onclick = function () {
            //nếu isPlaying = false (ko chạy)
            if (this.isPlaying) {
                audio.pause()
            }
            //nếu isPlaying = true (đang chạy)
            else {
                audio.play()
            }
        }

        //audio chạy
        audio.onplay = function () {
            btnplay.isPlaying = true
            $(".player").classList.add("playing");
            cdThumbAnimate.play()
        }
        //audio dừng
        audio.onpause = function () {
            btnplay.isPlaying = false
            $(".player").classList.remove("playing");
            cdThumbAnimate.pause()
        }

        //Cập nhật thanh progress theo thời gian chạy của nhạc (ontimeupdate).
        audio.ontimeupdate = function () {
            if (this.duration && !isNaN(this.duration)) {
                const progressPercent = (this.currentTime / this.duration) * 100
                progress.value = progressPercent // phần trăm hiện tại (1->100)               
            }
        }

        //Tua nhạc khi người dùng thay đổi giá trị thanh progress (onchange).
        progress.oninput = function (e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }

        //CD Rotate
        const cdThumbAnimate = cdThumb.animate(
            { transform: 'rotate(360deg)' },
            {
                duration: 5000, //seconds
                iterations: Infinity
            })
        cdThumbAnimate.pause()

        //Next Songs
        btnNext.onclick = function () {
            if (app.isRandom) {
                app.randomSongs()
            } else {
                app.nextSongs()
            }
            audio.play()
        }

        //Prev Songs
        btnPrev.onclick = function () {
            if (app.isRandom) {
                app.randomSongs()
            } else {
                app.prevSongs()
            }
            audio.play()
        }

        //Random Songs
        btnRandom.onclick = function () {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            this.classList.toggle('active', app.isRandom) //this mặc định là phần tử DOM kích hoạt sự kiện
        }

        //------------------------- Repeat Songs
        btnRepeat.onclick = function () {
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            this.classList.toggle('active', app.isRepeat) //this mặc định là phần tử DOM kích hoạt sự kiện
        }

        //Ra lệnh ... khi hết nhạc (onended)
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play()
            } else {
                btnNext.click()
            }
        }

        //Xử lý khi click bài hát
        dataPlaylist.onclick = function (e) {
            //Tìm phần tử cha gần nhất có class 'song' mà không có class 'active'.
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode) {
                app.songsIndex = Number(songNode.dataset.index)
                app.loadSongs()
                audio.play()
                app.render()
            }

            // Xử lý khi click nút yêu thích (btn-favorite)
            const btnFavorite = e.target.closest('.fa-heart')
            if (btnFavorite) {
                btnFavorite.classList.toggle('heart')
            }
        }

        //chế độ tối
        toggleDarkMode.onclick = function () {
            document.body.classList.toggle('dark-mode')
        }

        // Chức năng tìm kiếm
        searchInput.oninput = function () {
            const keyword = this.value.toLowerCase().trim()
            app.render(keyword)
        }

    },
    start: function () {
        this.render();
        this.loadStorage();
        this.defineProperties();
        this.loadSongs();
        this.hendleEvents();

        btnRandom.classList.toggle('active', app.isRandom)
        btnRepeat.classList.toggle('active', app.isRepeat)
    },
};
app.fetchSongsData();
