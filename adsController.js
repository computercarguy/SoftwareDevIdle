class AdsController {
    // CrazyGames API for ads
    constructor(adAward, pauseGame, watchedAd) {
        this.adsButton = document.getElementById("adsButton");
        this.AdAward = adAward;
        this.pauseGame = pauseGame;
        this.WatchedAd = watchedAd;

        this.SetupAds();
    }

    async SetupAds() {
        await window.CrazyGames.SDK.init();
    }

    AdsButtonClicked() {
        const callbacks = {
            adFinished: () => {
                this.AdAward(this.creditsAwarded);
                this.pauseGame();
            },
            adError: (error) => console.log("Error rewarded ad", error),
            adStarted: () => console.log("Start rewarded ad")
        };

        try {
            window.CrazyGames.SDK.ad.requestAd("rewarded", callbacks);
            this.adsButton.classList.add("hidden");
            this.adsButton.onclick = null;
            this.pauseGame();
            this.WatchedAd();
        } catch {}
    }

    UpdateButton(credits) {
        if (credits > 0) {
            if (this.adsButton.classList.contains("hidden")) {
                this.creditsAwarded = credits;
                this.adsButton.classList.remove("hidden");
                this.adsButton.innerHTML = `&#575;${credits} for watching ad <img src="camera-reels-white.svg"/>`;
                this.adsButton.onclick = null;
                this.adsButton.onclick = this.AdsButtonClicked.bind(this);
            } else {
                this.adsButton.classList.add("hidden");
            }
        }
    }
}
