class Hero {
  // 2. 넘겨받은 class명을 el로 받아준다.
  constructor(el) {
    // 3. 넘어온 클래스명으로 검색해 변수에 담는다.
    this.el = document.querySelector(el);

    // 9. 캐릭터 이동에 필요한 변수 추가.(초기화까지)
    // 9-1. 이동거리 movex, 이동속도 speed
    this.movex = 0;
    this.speed = 11;

    // 15. 수리검 방향 바꾸기
    // 15-1. 히어로가 보고 있는 방향을 알 수 있는 변수 추가
    this.direction = "right";

    // 23. 히어로의 공격 데미지 변수 추가
    // 23-1. 히어로의 공격 데미지 변수 추가
    this.attackDamage = 1000;

    /* 28-1-1. 히어로의 hp 변수
		  - 히어로의 체력을 백분율로 계산할 값을 담을 변수 추가
		*/
    this.hpProgress = 0;
    // 28-1-2. 히어로의 기본 체력 변수
    this.hpValue = 10000;
    // 28-1-3. 히어로의 초기 체력을 넣어둘 변수
    this.defaultHpValue = this.hpValue;

    // 32-4. 공격 데미지를 담을 새 변수 추가
    this.realDamage = 0;
  }
  // 1. 키를 눌렀을 때 히어로의 움직임을 변경
  keyMotion() {
    // 4. key down 오브젝트를 사용해 키 눌림을 체크.
    if (key.keyDown["left"]) {
      // 15-2. 키를 눌렀을 때 히어로 방향 변수 업데이트
      this.direction = "left";

      // 4.(2) key down 오브젝트를 사용해 키 눌림을 체크.
      this.el.classList.add("run");
      // 5. left를 누를 경우 반대편으로 뛰게 flip 클래스 추가
      this.el.classList.add("flip");

      /* 9-2. 'left'키가 눌릴 때 마이너스값으로 왼쪽으로 이동
        -    this.movex = this.movex - this.speed;
      */
      /* 19-1. 히어로가 왼쪽 화면을 끝을 넘어가는 문제 수정
        - 이동거리가 0보다 작거나 같다면 0으로 적용하고 그렇지 않다면 기존 코드로 적용. */
      this.movex = this.movex <= 0 ? 0 : this.movex - this.speed;
    } else if (key.keyDown["right"]) {
      // 15-2-1. 키를 눌렀을 때 히어로 방향 변수 업데이트
      this.direction = "right";

      this.el.classList.add("run");

      // 5-1. 댜시 right를 누를 경우 flip 클래스 제거
      this.el.classList.remove("flip");

      // 9-3. 'right'키가 눌리면 양수값으로 오른쪽으로 이동
      this.movex = this.movex + this.speed;
    }

    // 7. X 키를 눌렀을 경우 'attack' 클래스 추가
    if (key.keyDown["attack"]) {
      // 13-10. launch가 false일 때만 인스턴스 생성하게 조건문 추가
      if (!bulletComProp.launch) {
        this.el.classList.add("attack");

        /* 12-3. 공격 키를 눌렀을 때 수리검 클래스를 생성
          - new Bullet();
        */
        /* 13-2. 공격 키를 누를 때마다 push 메서드를 사용해서
          - 수리검의 모든 인스턴스를 배열에 추가 */
        bulletComProp.arr.push(new Bullet());

        // 13-11. launch 값을 true로 변경.
        bulletComProp.launch = true;
      }
    }

    // 6. left와 right 키 모두 뗐을 때 대기 동작이 나오게 적용
    if (!key.keyDown["left"] && !key.keyDown["right"]) {
      this.el.classList.remove("run");
    }

    // 8. X 키를 뗐을 경우 'attack' 클래스 제거
    if (!key.keyDown["attack"]) {
      this.el.classList.remove("attack");

      // 13-12. 공격 키를 뗐을 때 launch 값을 false로 변경
      bulletComProp.launch = false;
    }

    // 10. 히어로 element에 movex값을 대입해서 히어로가 움직이도록 해보자
    this.el.parentNode.style.transform = `translateX(${this.movex}px)`;
  }

  // 11. 히어로의 위치를 알아내는 position 메서드 추가
  position() {
    // 11-1. position함수를 호출 시 return 값 적용.
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,

      /* 11-2. 화면 아래를 기준으로 top값을 구하기
        - (화면높이 - 히어로의 탑값)
        - top: window.innerHeight - this.el.getBoundingClientRect().top,
      */
      // 11-4. 자주 사용하는 값 공통처리 (gameProp)
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,

      /* 11-3. 화면 아래를 기준으로 bottom값 구하기
        - (화면높이 - 히어로의 탑값 - 히어로의 높이)
        - bottom: window.innerHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height,
      */
      // 11-4-1. 자주 사용하는 값 공통처리 (gameProp)
      bottom:
        gameProp.screenHeight -
        this.el.getBoundingClientRect().top -
        this.el.getBoundingClientRect().height,
    };
  }
  // 12-11. 수리검이 히어로 손에 위치하기 위한 새로운 메서드 추가
  size() {
    // 12-12. 히어로 엘리먼트 넓이와 높이 리턴한다.
    return {
      // 12-13. offsetWidth와 offsetHeight 사용 (getBoundingClientRect를 사용하도 되지만!)
      width: this.el.offsetWidth,
      height: this.el.offsetHeight,
    };
  }

  /* 28-2. 히어로의 체력관리 메서드 추가 (몬스터와 충돌 시 닳게 적용)
	  -    updateHp(){
	*/
  // 28-6. 메서드 호출할 때 전달받은 인자값 추가
  updateHp(monsterDamage) {
    // 28-6-1. 히어로 Hp에서 몬스터데미지 값을 뺀다
    this.hpValue = this.hpValue - monsterDamage;
    /* 28-6-2. 백분율 구하기. 백분율 = 깍인HP / 디폴트HP * 100
			- Math.max 메서드를 사용해서 0 밑으로 내려가지 않게 적용. */
    this.hpProgress = Math.max(0, (this.hpValue / this.defaultHpValue) * 100);
    // 28-6-3. div.hp 안에 span 찾아서 hpProgress 값 대입
    const heroHpBox = document.querySelector(".state_box .hp span");
    heroHpBox.style.width = this.hpProgress + "%";

    // 29-4. crash()메서드 호출. : 히어로의 체력이 깍일 때 충돌 모션이 나오게 적용
    this.crash();

    // 29-6. 히어로의 hp가 모두 닳았을 때 dead() 메서트 호출
    if (this.hpValue === 0) {
      this.dead();
    }
  }

  // 29. 캐릭터 죽는 모션과 충돌 만들기
  // 29-1. 히어로의 충돌모션을 처리할 crash() 메서드 추가
  crash() {
    // 29-3. 추가한 css 모션 적용. 충돌했다면 히어로 엘리먼트에 hero.crash() 추가
    this.el.classList.add("crash");

    // 29-4-1. 충돌모션 후 원래 모습으로 돌아지 않는 문제 수정
    setTimeout(() => this.el.classList.remove("crash"), 400);
  }

  // 29-2. 캐릭터가 죽었을 때 모션을 처리할 dead() 메서드 추가
  dead() {
    // 29-5.히어로가 죽었을 때 모션 추가
    hero.el.classList.add("dead");

    // 30-2. endGame 함수 호출
    endGame();
  }

  // 32. 데미지 확률 변경
  /* 32-1. hitDamage()메서드 추가 
			몬스터와 충돌할 때마다 체크해서 확률 조정
	*/
  hitDamage() {
    /* 32-3. 히어로의 총 공격력에서 10% 빼기
			[[문제]] 공경력이 계속 감소! 이유는 10프로를 뺀 값을 다시 담고 있기 떄문. 별도의 변수가 필요하다.
					this.attackDamage = this.attackDamage - this.attackDamage * 0.1;
		*/
    /* 32-5. 새 변수에 담아주자.
     */
    this.realDamage =
      this.attackDamage - Math.round(Math.random() * this.attackDamage * 0.1);
  }
}

/*
 * 수리검
 */
// 12. 수리검 클래스 만들기
class Bullet {
  // 12-1. 생성자 추가
  constructor() {
    /* 12-4. 수리검 엘레먼트를 추가 할 부모 노드를 찾는다.
      - 부모 노드는 게임 엘레먼트이다. */
    this.parentNode = document.querySelector(".game");
    // 12-5. 수리검 엘레먼트 생성하고 클래스면 추가.
    this.el = document.createElement("div");
    this.el.className = "hero_bullet";
    // 12-8. 수리검 좌표(x,y)담을 변수 선언
    this.x = 0;
    this.y = 0;

    // 13-3. 수리검의 스피드, 거리 변수 추가
    this.speed = 30;
    this.distance = 0;

    // 15-5. 수리검의 방향을 알 수 있는 변수 추가
    this.bulletDirection = "right";

    // 12-6. Init 메서드 호출
    this.init();
  }
  // 12-2. init 메서드 추가
  init() {
    /* 15-5-1. 수리검을 생성할 때 히어로의 방향을 체크해서 수리검의 방향 정하기
      - 히어로 방향이 left 라면 left 적용, 아니라면 right 적용 */
    this.bulletDirection = hero.direction === "left" ? "left" : "right";

    /* 12-9. 추가한 x,y 변수에 히어로의 위치 넣기
      -    this.x = hero.position().left;
      -    this.y = hero.position().bottom ;
    */
    /* 12-13 size로 구한 width와 height을 left에는 width 더하고 bottom에는 height 빼는 등 손 위치만큼 계산해준다.
      -    this.x = hero.position().left + hero.size().width / 2;
    */
    /* 17-7. 수리검이 히어로가 이동한만큼의 위치에서 생성되게 적용
      - 히어로의 position().left가 아닌 히어로가 이동한만큼의 값을 더하고
      -    this.x = hero.movex + hero.size().width / 2;
    */
    // 19. 왼쪽으로 수리검 던질 때 캐릭터 뒤에서 생성되는 문제 수정
    this.x =
      this.bulletDirection === "right"
        ? hero.movex + hero.size().width / 2
        : hero.movex - hero.size().width / 2;
    this.y = hero.position().bottom - hero.size().height / 2;

    // 13-13. 수리검의 x좌표를 distance 값에 넣어준다. (즉, 히어로의 위치값을 넣어주는 것)
    this.distance = this.x;

    // 12-10. 생성한 Bullet 엘리먼트에 x,y값 적용
    this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    // 12.7. 부모 노드에 생성한 태그를 자식 태그로 붙이기
    this.parentNode.appendChild(this.el);
  }
  // 13-4. 수리검의 이동을 담당할 moveBullet 메서드 생성
  moveBullet() {
    // 15-4. 수리검 이미지 수정
    // 15-4-1. rotate 를 담을 변수 추가
    let setRotate = "";

    // 15-3. 히어로가 보고있는 방향으로 수리검 이동
    // (13-7 코드 주석 처리)
    // 15-5-2. 기존에 히어로 방향으로 수리검 방향을 결정했던 코드(15-3번)를
    // 수리검을 생성할 때의 방향을 체크하는 코드로 수정
    //if (hero.direction === "left") {
    if (this.bulletDirection === "left") {
      this.distance -= this.speed;

      // 15-4-2.
      setRotate = "rotate(180deg)";
    } else {
      this.distance += this.speed;
    }
    // 13-7. 먼저 수리검이 이동할 거리 distance 변수에
    // 수리검의 스피드를 더해준다. (수리검의 거리는 계속해서 30씩 증가)
    //this.distance += this.speed;

    // 13-8. this.distance 값을 수리검 엘리먼트에 적용하면 수리검이 이동한다.
    // 15-4-3. setRotate 속성 적용
    this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;

    // 14-02. moveBullet 위치하여 수리검 이동할 때마다 호출
    this.crashBullet();
  }

  // 14. 히어로의 위치를 알아내는 position 메서드 그대로 복붙해서 적용
  // this.el 변수이기 떄문에 따로 수정할 필요는 없다.
  // 상속을 활용한다면 같은 메서드를 두 번 작성할 필요는 없다.
  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom:
        gameProp.screenHeight -
        this.el.getBoundingClientRect().top -
        this.el.getBoundingClientRect().height,
    };
  }

  // 14-01. 수리검 화면 벗어남과 충돌 체크 처리할 crachBullet 메서드 작성
  // 이 메서드는 수리검이 이동할 때마다 호출하며
  // 화면이 벗어났는지 충돌했는지 체크
  crashBullet() {
    // 24-3. 몬스터 배열의 길이(몬스터의 수)만큼 반복하는 반복문 추가.
    for (let j = 0; j < allMonsterComProp.arr.length; j++) {
      // 21-2. 수리검 왼쪽 위치 값이 몬스터의 왼쪽 위치 값보다 크다면 (충돌). (수리검 오른쪽 위치값으로 해도 됨)
      //    f(this.position().left > monster.position().left){
      // 21-4. 수리검의 왼쪽 위치값이 몬스터의 왼쪽 위치값보다 크고
      // 수리검의 오른쪽 위치값이 몬스터의 오른쪽 위치값보다 작다면 수리검 삭제
      if (
        // 24-3-1. monster 변수 제거하고 배열로 적용
        // this.position().left > monster.position().left &&
        // this.position().right < monster.position().right
        this.position().left > allMonsterComProp.arr[j].position().left &&
        this.position().right < allMonsterComProp.arr[j].position().right
      ) {
        // 21-3. 수리검 삭제 // 21-5-4로 이동
        //    this.el.remove();

        // 21-5. 배열에서 수리검 인스턴스 삭제
        // 21-5-1. 먼저 수리검이 몬스터와 충돌했을 때 수리검 배열의 길이만큼 반복하는 반복문 추가
        for (let i = 0; i < bulletComProp.arr.length; i++) {
          // 21-5-2. 현재 충돌한 수리검을 찾는 조건문 필요
          // 수리검 배열에 i번째 인스턴스가 현재 충돌한 수리검 this와 같다면
          if (bulletComProp.arr[i] === this) {
            // 32-2. hitDamage() 메서드를 몬스터와 충돌할 때마다 호출
            hero.hitDamage();

            // 21-5-3. 배열 삭제
            bulletComProp.arr.splice(i, 1);

            // 21-5-4. 21-3에서 적용한 수리검 삭제 코드를 splice 아래로 이동
            this.el.remove();

            /* 31-2. damageView() 호출
							    this.damageView();
						*/
            // 31-4.[[중요]] 충돌한 몬스터의 인스턴스를 넘겨준다
            this.damageView(allMonsterComProp.arr[j]);

            // 23-2-1. 몬스터와 수리검이 충돌할 때 updateHp() 호출
            //    monster.updateHp();
            // 24-3-2. monster 변수 제거하고 배열로 적용
            //    allMonsterComProp.arr[j].updateHp();
            // 25-4. 몬스터 배열에서 인스턴스 삭제
            // 25-4-1. 충돌한 인덱스j를 넘겨 받아서 updateHp에서 배열 제거
            allMonsterComProp.arr[j].updateHp(j);
          }
        }
      }
    }

    // 14-03. 수리검 왼쪽 위치가 스크린의 넓이보다 크다면
    // 수리검의 오른ㄴ쪽 위치가 0보다 작다면(화면 왼쪽을 벗어나면~!)
    // 두 조건을 만족한다면 수리검 엘리먼트 삭제
    if (
      this.position().left > gameProp.screenWidth ||
      this.position().right < 0
    ) {
      // 14.04. 수리검 엘리먼트를 삭제
      //    this.el.remove();

      // 21-5-5. 21-5-1의 반복문과 동일
      for (let i = 0; i < bulletComProp.arr.length; i++) {
        if (bulletComProp.arr[i] === this) {
          bulletComProp.arr.splice(i, 1);

          // 21-5-4. 14.04에서 적용한 수리검 삭제 코드를 splice 아래로 이동
          this.el.remove();
        }
      }
    }
  }

  // 31. 데미지 시각화 처리 및 랜덤 위치
  /* 31-1. damageView 메서드 추가
		     damageView(){
	*/
  // 31-4-1. 전달받은 인자 받기
  damageView(monster) {
    /* 31-3. 데미지 엘리먼트를 호출할 부모 찾기.
			 현재 화면 크기를 기준으로 데미지의 위치를 지정하기 위해 .game_app 선택.			 
		*/
    this.parentNode = document.querySelector(".game_app");
    // 31-3-1. 데미지 담을 엘리먼트 추가
    this.textDamageNode = document.createElement("div");
    this.textDamageNode.className = "text_damage";

    /* 31-3-2. 히어로의 공격력을 담을 텍스트 넣기
        this.textDamage = document.createTextNode(hero.attackDamage);
    */
    // 32-7. attackDamge -> realDamage 변경
    this.textDamage = document.createTextNode(hero.realDamage);

    // 31-3-3. 텍스트 노드를 텍스트데미지 엘리먼트에 추가
    this.textDamageNode.appendChild(this.textDamage);
    // 31-3-4. 텍스트 엘리먼트를 부모노드에 추가
    this.parentNode.appendChild(this.textDamageNode);

    // 31-5. 0~100까지의 난수 만들기
    // 31-5-1. 변수 추가
    let textPosition = Math.random() * -100;

    /* 31-4-2. 변수 추가 : 충돌한 몬스터의 위치값을 담을 변수.
				  let damagex = monster.position().left;
		*/
    // 31-5-2. damagex에 textPosition 더하기
    let damagex = monster.position().left + textPosition;
    let damagey = monster.position().top;

    // 31-4-3. 텍스트 데미지 엘리먼트에 damagex, damagey값을 대입
    this.textDamageNode.style.transform = `translate(${damagex}px, ${-damagey}px)`;

    // 31-6. 쌓인 텍스트 데미지 엘리먼트를 제거
    setTimeout(() => this.textDamageNode.remove(), 500);
  }
}

// 20. 몬스터 클래스 추가
class Monster {
  // 22-7. 인스턴스 생성할 때 넘어온 위치(positionX)와 체력(hp)을 Monster 클래스에서 처리
  constructor(positionX, hp) {
    this.parentNode = document.querySelector(".game");
    this.el = document.createElement("div");
    this.el.className = "monster_box";
    this.elChildren = document.createElement("div");
    this.elChildren.className = "monster";
    // 22.몬스터 체력 만들기
    // 22-1. 몬스터 체력이 될 엘리먼트 생성
    this.hpNode = document.createElement("div");
    this.hpNode.className = "hp";

    /* 22-2. 몬스터 실제 체력
      -  this.hpValue = 1000;
    */
    // 22-8. 기존 1000을 넣었던 hpValue에 인스터스 생성할 때 전달받은 hp 적용.
    this.hpValue = hp;

    // 26-4. 몬스터가 공격받으면 게이지가 줄어드는 기능 추가
    /* 26-4-1. 최초Hp를 담을 변수 추가
      - 이 변수는 최초Hp값 그대로 유지 */
    this.defaultHpValue = hp;

    /* 22-3. textNode 를 만들어 hpValue 적용    // 26-1. progress로 디자인하기 위해 기존 텍스트노드 변수 제거 (span으로 변경)
      -     this.hpTextNode = document.createTextNode(this.hpValue);
    */
    // 26-2. Progress 디자인 할 span 추가
    this.hpInner = document.createElement("span");

    // 22-9. 인스턴스 생성할 때 전달받은 positionX 변수 추가
    this.positionX = positionX;

    // 27-2. 변수 moveX, speed 추가
    this.moveX = 0;
    this.speed = 4;

    // 28. 히어로와 몬스터 충돌 시 에너지 관리
    // 28-1. 히어로와 몬스터가 충똘했을 때 충돌 데미지
    this.crashDamage = 100;

    this.init();
  }

  init() {
    /* 22-4. 생성한 몬스터 체력을 화면에 추가
      - hp 엘리먼트에 텍스트 노드 추가
      -     this.hpNode.appendChild(this.hpTextNode);
    */
    // 26-3. 기존 textnode 추가해주는 부분 hpInner 로 변경
    this.hpNode.appendChild(this.hpInner);

    // 22-5. hpNode를 monster_box에 추가
    this.el.appendChild(this.hpNode);

    this.el.appendChild(this.elChildren);
    this.parentNode.appendChild(this.el);

    // 22-10. positionX값을 엘리먼트에 대입.
    this.el.style.left = this.positionX + "px";
  }

  // 21. 몬스터 위치를 알 수 있는 position 추가(기존 Hero, Bullet position 복사)
  position() {
    return {
      left: this.el.getBoundingClientRect().left,
      right: this.el.getBoundingClientRect().right,
      top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
      bottom:
        gameProp.screenHeight -
        this.el.getBoundingClientRect().top -
        this.el.getBoundingClientRect().height,
    };
  }
  // 23-2. 몬스터의 체력을 관리할 메서드 추가
  //    updateHp() {
  // 25-4-2. crashBullet에서 넘겨받은 index값 받기
  updateHp(index) {
    // 23-3. 기능 추가
    /* 23-3-1. 충돌이 일어나면 몬스터의 hpValue에서 히어로의 공격력을 빼준다.
      -    this.hpValue = this.hpValue - hero.attackDamage;
    */
    /* 23-3-3. Math.max 함수를 사용해서 두 개의 값 중 항상 큰 값이 나오도록 수정
	        this.hpValue = Math.max(0, this.hpValue - hero.attackDamage);
		*/
    /* 32-6. 				
				실제 공격력을 담은 변수는 attackDamage가 아닌 realDamage로 변경되었기 때문에
				몬스터에게 타격되는 데미지를 attackDamage가 아닌 realDamage로 변경해야한다.*/
    this.hpValue = Math.max(0, this.hpValue - hero.realDamage);

    // 26-4-3. 몬스터 게이지 백분율 구하기
    this.progress = (this.hpValue / this.defaultHpValue) * 100;

    // 26-4-5. 구한 백분율 값을 span에 적용
    this.el.children[0].children[0].style.width = this.progress + "%";
    /* 23-3-2. 변경된 몬스터의 체력을 hp 엘리먼트에 대입 //  26-4-4. 26-1 에서 관련 코드 삭제했기 때문에 제거
      -     this.el.children[0].innerText = this.hpValue;
    */

    // 25-2. 몬스터 체력이 0이 되면 호출 (조건문)
    if (this.hpValue === 0) {
      // 25-4-3으로 인해 수정
      //    this.dead();
      // 25-4-3. dead 메서드에 index 값 넘겨주가
      this.dead(index);
    }
  }
  // 25. 몬스터 체력이 0되면 사라지게 적용
  /* 25-1. dead 메서드 추가
    -    dead() {
  */
  // 25-4-4. 넘겨받음 index 받기
  dead(index) {
    // 25-3. 기능 추가
    // 25-3-1. dead 메서드가 호출되면 remove 클래스 추가.(몬스터가 사라지는 스타일 클래스)
    this.el.classList.add("remove");
    // 25-3-2. monster-box element 제거
    setTimeout(() => this.el.remove(), 200);

    // 25-4. 몬스터 배열에서 인스턴스 삭제. // 25-4-4 에서 받은 index 값 추가
    allMonsterComProp.arr.splice(index, 1);
  }
  // 27. 몬스터를 이동시켜줄 메서드 생성 // 27-1.은 game.js에서 반복문으로 메서드 호출
  moveMonster() {
    /* 27-3. 몬스터의 이동 경로 확인해서 값 구하기. 이동경로: 오른쪽에서 왼쪽으로 이동
		  -     this.moveX -= this.speed;
		*/
    /* 27-5. 몬스터가 왼쪽 화면 밖으로 나갔는지 판단하여 몬스터 위치를 변경
		  - (몬스터가 이동한 거리 + 몬스터 소환 위치 + 몬스터의 넓이) 가 0보다 작거나 같다면 (화면 왼쪽을 넘어갔다면)  
		  -     if(this.moveX + this.positionX + this.el.offsetWidth <=0){
		*/
    /* 27-8. 히어로가 이동할 경우 몬스터가 왼쪽 화면 밖으로 나갔어도 왼쪽으로 이동하는 문제 발생.
		  - 히어로가 이동했기 때문에 나타나는 문제로 히어로가 이동한 거리를 빼서 조건문을 수정하자.
		  -     if(this.moveX + this.positionX + this.el.offsetWidth - hero.movex <=0){
		*/
    /* 27-9. 몬스터가 히어로 왼쪽 위치를 지나게 되면 바로 사라지는 문제 수정.
		  - 처음 히어로는 화면 왼쪽 끝에 있었지만 이동하게 되면 화면을 기준으로 중간 위치로 이동했기 때문이다.
		  - 히어로가 화면 기준으로 이동한 거리를 조건문에 더해서 해결. (+ hero.position().left)
		  - (실제 히어로가 이동한 거리와 화면을 기준으로 이동한 거리를 헷갈리지 말자)*/
    if (
      this.moveX +
        this.positionX +
        this.el.offsetWidth +
        hero.position().left -
        hero.movex <=
      0
    ) {
      /* 27-5-1. 몬스터 이동한 거리에 캐릭터 이동한 거리값을 넣어
			  - 일단은 히어로가 이동한 만큼의 위치에서 나타나도록 적용.
			  -     this.moveX = hero.moveX
			*/
      /* 27-6. 처음 인라인스타일로 세팅한 left값때문에 몬스터의 위치가 히어로 앞쪽에서 나타나는 문제 수정.
			  - 히어로의 현재 위치에서 몬스터의 소환 위치값 빼기
			  -     this.moveX = hero.moveX - this.positionX;
			*/
      /* 27-7. moveX에서 스크린 넓이를 더해서 화면 오른쪽 끝에서 다시 나타나도록 적용.
			  - this.moveX = hero.movex - this.positionX + gameProp.screenWidth;
			*/
      /* 27-10. 몬스터가 다시 나타날 때 약간 늦게 나타나는 문제
			 - 이것도 히어로가 화면을 기준으로 이동했기 때문이다. 히어로가 화면 기준으로 이동한 거리를 빼자  */
      this.moveX =
        hero.movex -
        this.positionX +
        gameProp.screenWidth -
        hero.position().left;
    } else {
      // 27-5-2. 0보다 크다면 몬스터가 계속 왼쪽으로 이동하게 적용
      this.moveX -= this.speed;
    }

    // 27-4. 27-3에서 구한 값을 monsterBox에 대입하자
    this.el.style.transform = `translateX(${this.moveX}px)`;

    // 28-3-1. 몬스터가 이동할 때마다 충돌했는지 체크
    this.crash();
  }

  /* 28-3. 몬스터가 이동했을 때 히어로와 충돌했는지 체크할 메서드
	  -  crash() 메서드 호출 위치는 (28-3-1)
	*/
  crash() {
    // 28-4-1. 몬스터와 히어로의 여백으로 인해 화면에서 충돌하지 않았음에도 충돌 로그가 뜨는 것처럼 보이는 문제 수정
    let rightDiff = 30;
    let leftDiff = 90;
    /* 28-4. 충돌 조건문 : 몬스터가 히어로를 지나가지 않았다면.
			- (히어로 오른쪽 위치가 몬스터 왼쪽 위치보다 클 경우) && 
				(히어로의 왼쪽 위치가 몬스터 오른쪽 위치보다 작을 경우)
			- if(hero.position().right > this.position().left && hero.position().left > this.position().right){
		*/
    /* 28-4-2. 히어로 오른쪽 위치값에서 rightDiff를 
			- 히어로 왼쪽에서 leftDiff를 빼주어 여백으로 인한 문제 수정하여 충돌 적확도를 높힌다. */
    if (
      hero.position().right - rightDiff > this.position().left &&
      hero.position().left - leftDiff > this.position().right
    ) {
      // 28-5. 몬스터와 히어로가 충돌했을 때 히어로 체력 관리하는 메서드 호출하고 충돌 데미지를 전달
      hero.updateHp(this.crashDamage);
    }
  }
}
