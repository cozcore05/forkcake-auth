<template>
  <div class="vinelight-app">
    <div class="app-background">
      <div class="arch-container">
        <div class="logo-section">
          <div class="logo"></div>
          <h1 class="title">VineLight</h1>
        </div>

        <div class="calendar-frame">
          <h2 class="calendar-title">Mood Tracker Calendar</h2>
          <h3 class="month-year">April 2024</h3>

          <div class="calendar">
            <div class="weekdays">
              <span v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day" class="weekday">{{
                day
              }}</span>
            </div>

            <div class="days">
              <!-- Empty cells before April 1st -->
              <div class="day empty" v-for="i in 1" :key="`empty-${i}`"></div>

              <!-- Days of April -->
              <div v-for="day in 30" :key="day" class="day">
                <span
                  :class="{
                    'has-entry': [3, 8, 9, 10, 11, 12].includes(day),
                    today: day === 3,
                  }"
                  >{{ day }}</span
                >
              </div>
            </div>
          </div>

          <button class="journal-button">New Journal Entry</button>
        </div>

        <div class="ceremony-section">
          <h3 class="ceremony-title">Ceremony Timeline</h3>
          <div class="ceremony-steps">
            <div class="step">Preparation</div>
            <div class="step">Ceremony</div>
            <div class="step">Integration</div>
          </div>
        </div>

        <!-- Moved navigation bar here, just below the ceremony section -->
        <nav class="bottom-nav fixed bottom-0">
          <div class="nav-item active">
            <i class="nav-icon home-icon"></i>
            <span class="nav-text">Home</span>
          </div>
          <div class="nav-item">
            <i class="nav-icon journal-icon"></i>
            <span class="nav-text">Journal</span>
          </div>
          <div class="nav-item">
            <i class="nav-icon rituals-icon"></i>
            <span class="nav-text">Rituals</span>
          </div>
          <div class="nav-item">
            <i class="nav-icon insights-icon"></i>
            <span class="nav-text">Insights</span>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic here
</script>

<style scoped>
/* Main container */
.vinelight-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #3a4a2f; /* Dark olive green background */
  color: #2c2c2c;
  font-family: 'Times New Roman', serif;
  position: relative;
  overflow-x: hidden;
}

.app-background {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  /* Enhanced embroidery background pattern - Celtic knot inspired */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cpath fill='none' stroke='%23c9bc8f' stroke-width='1.5' opacity='0.15' d='M0,100 C50,50 150,50 200,100 C250,150 350,150 400,100 M0,200 C50,150 150,150 200,200 C250,250 350,250 400,200 M0,300 C50,250 150,250 200,300 C250,350 350,350 400,300'/%3E%3Cpath fill='none' stroke='%23c9bc8f' stroke-width='1.5' opacity='0.1' d='M100,0 C50,50 50,150 100,200 C150,250 150,350 100,400 M200,0 C150,50 150,150 200,200 C250,250 250,350 200,400 M300,0 C250,50 250,150 300,200 C350,250 350,350 300,400'/%3E%3Cpath fill='none' stroke='%23c9bc8f' stroke-width='1' opacity='0.1' d='M0,0 L400,400 M400,0 L0,400'/%3E%3Cpath fill='none' stroke='%23c9bc8f' stroke-width='1.5' opacity='0.1' d='M200,50 C300,50 350,150 350,200 C350,250 300,350 200,350 C100,350 50,250 50,200 C50,150 100,50 200,50 Z'/%3E%3Cpath fill='none' stroke='%23c9bc8f' stroke-width='1' opacity='0.15' d='M0,0 L0,400 M50,0 L50,400 M100,0 L100,400 M150,0 L150,400 M200,0 L200,400 M250,0 L250,400 M300,0 L300,400 M350,0 L350,400 M400,0 L400,400 M0,0 L400,0 M0,50 L400,50 M0,100 L400,100 M0,150 L400,150 M0,200 L400,200 M0,250 L400,250 M0,300 L400,300 M0,350 L400,350 M0,400 L400,400'/%3E%3C/svg%3E");
  background-size: 400px;
  background-position: center;
}

/* Arch-shaped container */
.arch-container {
  width: 100%;
  max-width: 320px;
  min-height: calc(100vh - 20px);
  background-color: #d5c9a3; /* Tan/beige background */
  border-radius: 160px 160px 0 0 / 80px 80px 0 0;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0;
  /* Enhanced embroidery pattern inside container - Floral pattern */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath fill='none' stroke='%23554c2a' stroke-width='0.8' opacity='0.15' d='M20,20 C40,0 60,0 80,20 C100,40 120,40 140,20 C160,0 180,0 200,20 M20,60 C40,40 60,40 80,60 C100,80 120,80 140,60 C160,40 180,40 200,60 M20,100 C40,80 60,80 80,100 C100,120 120,120 140,100 C160,80 180,80 200,100 M20,140 C40,120 60,120 80,140 C100,160 120,160 140,140 C160,120 180,120 200,140 M20,180 C40,160 60,160 80,180 C100,200 120,200 140,180 C160,160 180,160 200,180'/%3E%3Cpath fill='none' stroke='%23554c2a' stroke-width='0.8' opacity='0.15' d='M20,20 C0,40 0,60 20,80 C40,100 40,120 20,140 C0,160 0,180 20,200 M60,20 C40,40 40,60 60,80 C80,100 80,120 60,140 C40,160 40,180 60,200 M100,20 C80,40 80,60 100,80 C120,100 120,120 100,140 C80,160 80,180 100,200 M140,20 C120,40 120,60 140,80 C160,100 160,120 140,140 C120,160 120,180 140,200 M180,20 C160,40 160,60 180,80 C200,100 200,120 180,140 C160,160 160,180 180,200'/%3E%3C/svg%3E");
  background-size: 100px;
}

/* Logo and title section */
.logo-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 0 15px;
  position: relative;
  /* Enhanced embroidery pattern for logo section - Circular mandala */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Ccircle cx='150' cy='150' r='140' fill='none' stroke='%23554c2a' stroke-width='0.8' opacity='0.1'/%3E%3Ccircle cx='150' cy='150' r='120' fill='none' stroke='%23554c2a' stroke-width='0.8' opacity='0.1'/%3E%3Ccircle cx='150' cy='150' r='100' fill='none' stroke='%23554c2a' stroke-width='0.8' opacity='0.1'/%3E%3Ccircle cx='150' cy='150' r='80' fill='none' stroke='%23554c2a' stroke-width='0.8' opacity='0.1'/%3E%3Cpath fill='none' stroke='%23554c2a' stroke-width='0.8' opacity='0.1' d='M150,10 L150,290 M10,150 L290,150 M30,30 L270,270 M30,270 L270,30'/%3E%3Cpath fill='none' stroke='%23554c2a' stroke-width='0.8' opacity='0.1' d='M150,50 C200,50 250,100 250,150 C250,200 200,250 150,250 C100,250 50,200 50,150 C50,100 100,50 150,50 Z'/%3E%3C/svg%3E");
  background-size: 300px;
  background-position: center;
}

.logo {
  width: 70px;
  height: 70px;
  position: relative;
  margin-bottom: 12px;
  /* Enhanced logo with more detailed embroidery pattern */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='none' stroke='%23554c2a' stroke-width='0.5' opacity='0.2'/%3E%3Cg stroke='%23554c2a' fill='none'%3E%3Ccircle cx='50' cy='50' r='30' stroke-width='1.5'/%3E%3Ccircle cx='50' cy='50' r='20' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='10' stroke-width='1'/%3E%3Cpath d='M50,20 L50,80 M20,50 L80,50 M29.3,29.3 L70.7,70.7 M29.3,70.7 L70.7,29.3' stroke-width='1.5'/%3E%3C/g%3E%3Cpath d='M50,15 C55,20 60,20 65,20 C70,20 75,20 80,25 C85,30 85,35 85,40 C85,45 85,50 80,55 C75,60 70,60 65,60 C60,60 55,60 50,65 C45,60 40,60 35,60 C30,60 25,60 20,55 C15,50 15,45 15,40 C15,35 15,30 20,25 C25,20 30,20 35,20 C40,20 45,20 50,15 Z' fill='none' stroke='%23554c2a' stroke-width='1.5'/%3E%3Cpath d='M30,15 Q35,5 40,15 M60,15 Q65,5 70,15 M15,30 Q5,35 15,40 M15,60 Q5,65 15,70 M85,30 Q95,35 85,40 M85,60 Q95,65 85,70 M30,85 Q35,95 40,85 M60,85 Q65,95 70,85' stroke='%23554c2a' fill='none' stroke-width='1.2'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.title {
  font-size: 2rem;
  margin: 0;
  font-weight: normal;
  color: #2c2c2c;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* Calendar frame */
.calendar-frame {
  width: 85%;
  margin: 0 auto;
  padding: 10px;
  border: 1px solid #554c2a;
  position: relative;
  background-color: transparent;
  /* Enhanced embroidery pattern for calendar frame - Geometric pattern */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%23554c2a' stroke-width='0.5' opacity='0.15' d='M0,0 L100,100 M100,0 L0,100 M25,0 L25,100 M50,0 L50,100 M75,0 L75,100 M0,25 L100,25 M0,50 L100,50 M0,75 L100,75'/%3E%3Cpath fill='none' stroke='%23554c2a' stroke-width='0.5' opacity='0.1' d='M0,0 L100,0 L100,100 L0,100 Z M10,10 L90,10 L90,90 L10,90 Z M20,20 L80,20 L80,80 L20,80 Z M30,30 L70,30 L70,70 L30,70 Z M40,40 L60,40 L60,60 L40,60 Z'/%3E%3C/svg%3E");
  background-size: 20px;
}

/* Decorative corners for calendar frame */
.calendar-frame::before,
.calendar-frame::after,
.calendar-frame > :first-child::before,
.calendar-frame > :first-child::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  border-color: #554c2a;
  border-style: solid;
}

.calendar-frame::before {
  top: -1px;
  left: -1px;
  border-width: 1px 0 0 1px;
}

.calendar-frame::after {
  top: -1px;
  right: -1px;
  border-width: 1px 1px 0 0;
}

.calendar-frame > :first-child::before {
  bottom: -1px;
  left: -1px;
  border-width: 0 0 1px 1px;
}

.calendar-frame > :first-child::after {
  bottom: -1px;
  right: -1px;
  border-width: 0 1px 1px 0;
}

/* Typography */
.calendar-title {
  font-size: 0.95rem;
  text-align: center;
  margin: 0 0 3px;
  font-weight: normal;
  color: #2c2c2c;
}

.month-year {
  font-size: 0.9rem;
  text-align: center;
  margin: 3px 0 8px;
  font-weight: normal;
  color: #2c2c2c;
}

/* Calendar */
.calendar {
  width: 100%;
  margin-bottom: 12px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 5px;
}

.weekday {
  font-size: 0.75rem;
  padding: 2px;
  color: #2c2c2c;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day.empty {
  visibility: hidden;
}

.day span {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #2c2c2c;
  transition: transform 0.2s ease;
}

.day span:hover {
  transform: scale(1.1);
}

.day span.has-entry {
  border-radius: 50%;
  border: 1px solid #554c2a;
}

.day span.today {
  background-color: #7d8e5c;
  border-radius: 50%;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Button */
.journal-button {
  background-color: #7d8e5c;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-family: 'Times New Roman', serif;
  font-size: 0.85rem;
  color: #2c2c2c;
  margin: 5px 0 10px;
  width: 90%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.journal-button:hover {
  background-color: #6a7a4d;
  transform: translateY(-1px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15);
}

.journal-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Ceremony Section */
.ceremony-section {
  width: 85%;
  margin: 10px auto 0;
}

.ceremony-title {
  text-align: center;
  font-size: 0.9rem;
  margin: 5px 0;
  font-weight: normal;
  color: #2c2c2c;
}

.ceremony-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 15px;
}

.step {
  text-align: center;
  font-size: 0.75rem;
  flex: 1;
  padding: 2px;
  color: #2c2c2c;
  position: relative;
  transition: color 0.2s ease;
}

.step:hover {
  color: #554c2a;
}

.step:not(:last-child)::after {
  content: '•';
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  color: #554c2a;
  opacity: 0.7;
}

/* Bottom Navigation - Now inside the arch container */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  background-color: #2c2c2c;
  padding: 10px 0;
  width: 100%;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
  border-radius: 0 0 0 0;
  /* Enhanced embroidery pattern for nav bar - Zigzag pattern */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='20' viewBox='0 0 100 20'%3E%3Cpath fill='none' stroke='%23554c2a' stroke-width='0.5' opacity='0.1' d='M0,10 L10,0 L20,10 L30,0 L40,10 L50,0 L60,10 L70,0 L80,10 L90,0 L100,10 M0,20 L10,10 L20,20 L30,10 L40,20 L50,10 L60,20 L70,10 L80,20 L90,10 L100,20'/%3E%3C/svg%3E");
  background-size: 100px 20px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #c9bc8f;
  font-size: 0.7rem;
  opacity: 0.7;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.nav-item:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.nav-item.active {
  opacity: 1;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
  background-position: center;
  background-repeat: no-repeat;
}

.home-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9bc8f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/%3E%3Cpolyline points='9 22 9 12 15 12 15 22'/%3E%3C/svg%3E");
}

.journal-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9bc8f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'/%3E%3Cpath d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'/%3E%3C/svg%3E");
}

.rituals-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9bc8f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 2 7 12 12 22 7 12 2'/%3E%3C/svg%3E");
}

.insights-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9bc8f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpolyline points='12 6 12 12 16 14'/%3E%3C/svg%3E");
}

/* Responsive adjustments */
@media (min-width: 375px) {
  .arch-container {
    max-width: 320px;
  }

  .logo {
    width: 75px;
    height: 75px;
  }

  .day span {
    width: 24px;
    height: 24px;
  }
}

@media (min-width: 768px) {
  .arch-container {
    max-width: 360px;
  }

  .logo {
    width: 80px;
    height: 80px;
  }

  .title {
    font-size: 2.2rem;
  }

  .calendar-title {
    font-size: 1rem;
  }

  .month-year {
    font-size: 0.95rem;
  }

  .day span {
    width: 26px;
    height: 26px;
    font-size: 0.8rem;
  }

  .journal-button {
    font-size: 0.9rem;
  }

  .ceremony-title {
    font-size: 1rem;
  }

  .step {
    font-size: 0.8rem;
  }
}

/* Animation for better UI experience */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.vinelight-app {
  animation: fadeIn 0.5s ease-in-out;
}

/* Prevent text selection for better mobile experience */
.vinelight-app {
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Improve touch targets for mobile */
.day span,
.journal-button,
.nav-item {
  touch-action: manipulation;
}
</style>
