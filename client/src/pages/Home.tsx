const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO SECTION */}
      <section
        className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          items-center
          justify-between
          gap-14
          px-4
          py-16
          sm:px-6
          lg:flex-row
          lg:px-8
          lg:py-20
        "
      >
        {/* LEFT CONTENT */}
        <div className="max-w-2xl text-center lg:text-left">
          <div
            className="
              mb-6
              inline-flex
              items-center
              rounded-full
              border
              border-[rgb(3_131_153/0.2)]
              bg-[rgb(3_131_153/0.08)]
              px-4
              py-2
              text-sm
              font-medium
              text-[rgb(3_131_153)]
            "
          >
            🌊 Your safe space for emotions
          </div>

          <h1
            className="
              font-serif
              text-4xl
              font-light
              leading-tight
              tracking-wide
              text-slate-800
              sm:text-5xl
              lg:text-6xl
            "
          >
            Listen to what your
            <span className="font-medium text-[rgb(3_131_153)]">
              {" "}heart{" "}
            </span>
            truly feels.
          </h1>

          <p
            className="
              mt-6
              max-w-xl
              font-light
              leading-relaxed
              text-slate-600
              sm:text-lg
            "
          >
            Moodyfy gently guides you to express,
            understand, and embrace every emotion.
            With compassionate AI and mindful tools,
            discover the beauty of your inner world.
          </p>

          {/* BUTTONS */}
          <div
            className="
              mt-10
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:justify-center
              lg:justify-start
            "
          >
            <button
              className="
                group
                rounded-full
                bg-[rgb(3_131_153)]
                px-8
                py-3
                font-serif
                text-sm
                font-medium
                uppercase
                tracking-wide
                text-white
                transition-all
                duration-300
                hover:bg-[rgb(2_100_120)]
                hover:shadow-md
                active:scale-95
              "
            >
              Begin your journey
            </button>

            <button
              className="
                rounded-full
                border
                border-slate-200
                bg-white/80
                px-8
                py-3
                font-serif
                text-sm
                font-medium
                uppercase
                tracking-wide
                text-slate-600
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-[rgb(3_131_153/0.3)]
                hover:text-[rgb(3_131_153)]
              "
            >
              Discover features
            </button>
          </div>

          {/* STATS */}
          <div
            className="
              mt-16
              grid
              grid-cols-2
              gap-8
              sm:grid-cols-3
            "
          >
            <div className="border-r border-slate-100 last:border-none">
              <h3 className="font-serif text-3xl font-light text-slate-800">15K+</h3>
              <p className="mt-1 text-sm font-light text-slate-500">Heartfelt entries</p>
            </div>
            <div className="border-r border-slate-100 last:border-none">
              <h3 className="font-serif text-3xl font-light text-slate-800">Gentle AI</h3>
              <p className="mt-1 text-sm font-light text-slate-500">Emotional insights</p>
            </div>
            <div className="border-r border-slate-100 last:border-none">
              <h3 className="font-serif text-3xl font-light text-slate-800">Daily</h3>
              <p className="mt-1 text-sm font-light text-slate-500">Mood reflections</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="w-full max-w-md">
          <div
            className="
              rounded-3xl
              border
              border-slate-100
              bg-white/60
              p-6
              shadow-sm
              backdrop-blur-sm
            "
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-light text-slate-500">Today's heartspace</p>
                <h2 className="mt-1 font-serif text-2xl font-medium text-slate-800">Peaceful 🌊</h2>
              </div>
              <div className="rounded-full bg-[rgb(3_131_153/0.1)] px-4 py-1.5 text-sm font-light text-[rgb(3_131_153)]">
                +18% calmer
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50/80 p-5">
              <p className="font-light italic leading-relaxed text-slate-600">
                "Today, I allowed myself to rest without guilt.
                My mind feels softer, like waves returning to the ocean."
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <p className="font-light text-slate-500">Emotional balance</p>
                  <p className="font-light text-slate-700">84%</p>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div className="h-1.5 w-[84%] rounded-full bg-[rgb(3_131_153)]" />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <p className="font-light text-slate-500">Peaceful streak</p>
                  <p className="font-light text-slate-700">12 days</p>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div className="h-1.5 w-[65%] rounded-full bg-[rgb(3_131_153/0.7)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-light tracking-wide text-slate-800 sm:text-4xl">
            Nurture your emotional world
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-light leading-relaxed text-slate-600">
            Gentle tools to help you connect, reflect, and grow through every feeling.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Compassionate AI",  desc: "Gentle insights to help you understand emotional patterns without judgment.", icon: "🫂", gradient: "from-rose-50 to-orange-50",   iconBg: "bg-rose-100"    },
            { title: "Mood tending",       desc: "Tend to your feelings daily and watch how they bloom over time.",            icon: "🌱", gradient: "from-emerald-50 to-teal-50", iconBg: "bg-emerald-100" },
            { title: "Voice whispers",     desc: "Speak freely, and let your words become gentle journal entries.",            icon: "🎤", gradient: "from-indigo-50 to-blue-50",  iconBg: "bg-indigo-100"  },
            { title: "Gratitude dew",      desc: "Collect small moments of thankfulness like morning dewdrops.",               icon: "💧", gradient: "from-sky-50 to-cyan-50",     iconBg: "bg-sky-100"     },
            { title: "Emotion garden",     desc: "Visualize your emotional landscape as a growing, peaceful garden.",          icon: "🌸", gradient: "from-pink-50 to-rose-50",    iconBg: "bg-pink-100"    },
            { title: "Quiet sanctuary",    desc: "Your thoughts are safe, encrypted, and always respected.",                   icon: "🕊️", gradient: "from-slate-50 to-gray-50",   iconBg: "bg-slate-100"   },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${feature.gradient} p-0.5 transition-all duration-500 hover:shadow-xl hover:-translate-y-2`}
            >
              <div className="relative h-full rounded-3xl bg-white/90 p-7 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/70">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[rgb(3_131_153/0.03)] transition-all duration-500 group-hover:scale-150" />
                <div className="relative">
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.iconBg} text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-serif text-xl font-medium tracking-wide text-slate-800 transition-colors group-hover:text-[rgb(3_131_153)]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 font-light leading-relaxed text-slate-600">{feature.desc}</p>
                  <div className="mt-4 h-0.5 w-0 rounded-full bg-[rgb(3_131_153)] transition-all duration-300 group-hover:w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;