const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h3");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const btnplay = $(".btn-toggle-play")
const isPlaying = true
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const isRandom = false

const app = {
    songsIndex: 0,
    songs: [
        {
            name: "Sự Nghiệp Chướng",
            singer: "Pháo",
            path: "/MusicPlayer/assets/music/Sự nghiệp Chướng.mp3",
            image: "/MusicPlayer/assets/img/playlist/SuNghiepChuong.jpg",
        },
        {
            name: "Tệ Thật Anh Nhớ Em",
            singer: "Thanh Hưng",
            path: "/MusicPlayer/assets/music/Tệ Thật, Anh Nhớ Em  Thanh Hưng  Piano cover  Nguyenn.mp3",
            image: "/MusicPlayer/assets/img/playlist/TeThatAnhNhoEm.jpg",
        },
        {
            name: "Sẽ Có Người Tốt Hơn",
            singer: "Min.T",
            path: "/MusicPlayer/assets/music//Sẽ Có Người Tốt Hơn Min.T  Piano cover Nguyenn.mp3",
            image: "/MusicPlayer/assets/img/playlist/Sẽ Có Người Tốt Hơn.jpg",
        },
        {
            name: "Đoạn Kết Cuối",
            singer: "Vũ Thịnh - FANNY",
            path: "/MusicPlayer/assets/music/ĐOẠN KẾT CUỐI - VŨ THỊNH (FT. FANNY)  PIANO COVER  NGUYENN.mp3",
            image: "/MusicPlayer/assets/img/playlist/DoanKetCuoi.jpg",
        },
        {
            name: "Song Title 5",
            singer: "Singer Name 5",
            path: "",
            image: "",
        },
        {
            name: "Song Title 5",
            singer: "Singer Name 5",
            path: "",
            image: "",
        },
        {
            name: "Song Title 5",
            singer: "Singer Name 5",
            path: "",
            image: "",
        },
        {
            name: "Song Title 5",
            singer: "Singer Name 5",
            path: "",
            image: "",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song) => {
            return `
          <div class="song">
            <div class="thumb" style=" background-image: url('${song.image}');"></div>           
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        });
        $(".playlist").innerHTML = htmls.join("\n");
    },

    hendleEvents: function () {
        //zoom cd-thuhmb
        const cd = $(".cd");
        const newCd = cd.offsetWidth; // get width value

        document.onscroll = function () {
            const scrollTop = window.scrollY;
            const setWidth = newCd - scrollTop;

            cd.style.width = setWidth > 0 ? setWidth + "px" : "0px";
            cd.style.opacity = setWidth / newCd;
        }

        //lắng nghe và xử lý play + pause
        btnplay.onclick = function () {
            //nếu isPlaying = false (ko chạy)
            if (btnplay.isPlaying) {
                audio.pause()
            }
            //nếu isPlaying = true (đang chạy)
            else {
                audio.play()
            }
        }
        audio.onplay = function () {
            btnplay.isPlaying = true
            $(".player").classList.add("playing");
            cdThumbAnimate.play()
        }
        audio.onpause = function () {
            btnplay.isPlaying = false
            $(".player").classList.remove("playing");
            cdThumbAnimate.pause()
        }

        //Cập nhật thanh progress theo thời gian chạy của nhạc (ontimeupdate).
        audio.ontimeupdate = function () {
            if (audio.duration && !isNaN(audio.duration)) {
                const progressPercent = (audio.currentTime / audio.duration) * 100
                progress.value = progressPercent // phần trăm hiện tại (1->100)               
            }
        }

        //Cho phép tua nhạc khi người dùng thay đổi giá trị thanh progress (onchange).
        progress.oninput = function (e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }
        //CD Rotate
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
        ], {
            duration: 5000, //seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Next Songs
        btnNext.onclick = function () {
            app.nextSongs()
            audio.play()
        }
        //Prev Songs
        btnPrev.onclick = function () {
            app.prevSongs()
            audio.play()
        }
        //Random nhạc
        btnRandom.onclick = function () {
            if (btnRandom.isRandom) {
                btnRandom.isRandom = false
                btnRandom.classList.remove('active')
            } else {
                btnRandom.isRandom = true
                btnRandom.classList.add('active')
            }
        }
    },

    //Next nhạc
    nextSongs: function () {
        this.songsIndex++
        if (this.songsIndex >= this.songs.length) {
            this.songsIndex = 0
        }
        this.loadSongs()
    },

    //Prev nhạc
    prevSongs: function () {
        this.songsIndex--
        if (this.songsIndex < 0) {
            this.songsIndex = this.songs.length - 1
        }
        this.loadSongs()
    },

    defineProperties: function () {
        Object.defineProperty(this, "getSongs", {
            get: function () {
                return this.songs[this.songsIndex];
            },
        });
    },

    //Tải dữ liệu
    loadSongs: function () {
        heading.textContent = this.getSongs.name;
        cdThumb.style.backgroundImage = `url('${this.getSongs.image}')`;
        audio.src = this.getSongs.path;
    },

    start: function () {
        this.defineProperties();
        this.loadSongs();
        this.hendleEvents();
        this.render();
    },
};
app.start();
