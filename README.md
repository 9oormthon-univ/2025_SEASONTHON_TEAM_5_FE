what_to_eat_today

가계부 + 레시피 추천을 목표로 만든 Expo(React Native) 앱입니다.
오프라인 우선(백엔드 없이)으로 지출 관리, 예산 설정, 캘린더별 지출 조회, 재료 기반 레시피 추천 기능을 제공합니다.

✨ 주요 기능

메인 화면

이번 달 총 지출/남은 예산 요약, 최근 지출 내역

상단 + 버튼으로 지출 추가

예산 관리

월 예산/사용 기한(일수) 설정 (Zustand + AsyncStorage 영구 저장)

“식비 등록” 버튼 → 지출 추가 화면 이동

“GotoRecipe” 버튼 → 레시피 추천 탭으로 이동

캘린더

날짜 선택 시 해당 날짜 지출 목록 표시

지출이 있는 날짜 dot 마킹

플로팅 + → 선택 날짜가 프리필된 지출 추가

레시피 추천

재료 등록 ↔ 내 재료 모드 스위치(화면 전환 없이 부드러운 토글)

유통기한 임박 재료 섹션, 내 재료 그리드 카드

저장/상태관리

지출: src/features/main/store/expenseStore.js

예산: src/features/budget/store/budgetStore.js

월 합계 훅: src/features/main/hooks/useMonthlyBudget.js

🚀 실행 방법
요구 사항

Node.js LTS

Android Studio(에뮬레이터) 또는 실기기 + Expo Go

Git

설치 & 실행
git clone 
cd what_to_eat_today
npm install

# 개발 서버 시작
npx expo start


DevTools/터미널에서 단축키:

a: Android 에뮬레이터 실행

i: iOS 시뮬레이터(맥)

w: 웹

실기기: Expo Go 앱으로 QR 스캔

연결 이슈 시(안드로이드):

adb reverse --remove-all
adb reverse tcp:8081  tcp:8081
adb reverse tcp:19000 tcp:19000
adb reverse tcp:19001 tcp:19001

🧭 프로젝트 구조
src/
  features/
    main/
      components/        # MainHeader, MonthSummary, RecentExpenses
      hooks/             # useMonthlyBudget.js
      screens/           # MainScreen, AddExpenseScreen
      store/             # expenseStore.js
      navigations/       # MainStack.js
    calendar/
      components/        # CalendarHeader, ExpenseItem, ExpensesOfDay
      screens/           # CalendarScreen
    budget/
      components/        # BudgetHeader, BudgetSetup, FoodRegister, GotoRecipe
      screens/           # BudgetScreen
      store/             # budgetStore.js
    recipe/
      components/        # ModeSwitch, RegisterButtons, RecommendCard,
                         # ExpiringIngredients, IngredientCard, MyIngredientsGrid
      screens/           # RecipeScreen (토글 방식)
      navigations/       # (옵션) RecipeStack
  navigations/           # AppTabs.js (하단 탭)
  theme/                 # colors.js
  utils/                 # format.js
