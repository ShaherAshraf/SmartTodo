/**
 * @file A script for Smart Todo project.
 * @author Shaher Ashraf <shaherashraf77@gmail.com>
 * @version 1.0
 * @copyright Shaher Ashraf 2021
 */

window.addEventListener('DOMContentLoaded', () => {
  /* || All DOM Elements */
  body = document.querySelector('body');
  header = document.querySelector('.header');
  logo = document.querySelector('.logo');
  main = document.querySelector('main');
  heroSection = document.querySelector('.hero');
  configBtn = document.querySelector('.cog-icon');
  configOptions = document.querySelectorAll('.cog li');
  audioBtns = document.querySelectorAll('.volume-icon');
  mobAudioBtn = document.querySelector('.config .cog .volume-icon');
  modeBtns = document.querySelectorAll('.mode-icon');
  mobModeBtn = document.querySelector('.config .cog .mode-icon');
  arBtns = document.querySelectorAll('.lang-ar');
  enBtns = document.querySelectorAll('.lang-en');
  heroHeadline = document.querySelector('.hero__headline');
  heroSubHeadline = document.querySelector('.hero__sub-headline');
  scrollDownBtn = document.querySelector('.down-arrow');
  tasksHeadline = document.querySelector('.tasks__headline');
  tasksSubHeadline = document.querySelector('.tasks__sub-headline');
  addBtn = document.querySelector('.add-icon');
  scrollTopBtn = document.querySelector('.up-arrow');
  scrollBtns = document.querySelectorAll('.scroll');
  tasksForm = document.querySelector('.tasks__form');
  formTextField = document.querySelector(`input[type = 'text']`);
  saveBtn = document.querySelector('.save');
  cancelBtn = document.querySelector('.cancel');
  tasksList = document.querySelector('.tasks__list');

  /**
   * The array of objects to be stored at the first commit to localStorage.
   * @type {Array.<object>}
   */
  let allTodos = [];

  /**
   * The assumed previously-stored todos in localStorage.
   * @type {Array.<object>}
   */
  const previousData = JSON.parse(localStorage.getItem('allTodos')) || [];

  /**
   * Creates a new todo & saves all information in the localStorage.
   */
  const createTodo = () => {
    // pressing the addBtn
    addBtn.addEventListener('click', () => {
      heroSection.style.display = `none`;
      tasksHeadline.style.display = `none`;
      tasksSubHeadline.style.display = `none`;
      tasksList.style.display = `none`;
      tasksForm.style.display = `block`;

      // pressing the cancelBtn
      cancelBtn.addEventListener('click', () => {
        heroSection.style.display = `block`;
        formTextField.value = '';
        tasksForm.style.display = `none`;
        tasksHeadline.style.display = `block`;
        tasksList.style.display = `block`;
        /* show the default message */
        const listItems = document.querySelectorAll('.list-item');
        if (listItems.length == 0) {
          tasksSubHeadline.style.display = `block`;
        }
      });
    });

    // pressing the saveBtn
    tasksForm.addEventListener('submit', (e) => {
      /* change the layout */
      e.preventDefault();
      tasksForm.style.display = `none`;
      tasksHeadline.style.display = `block`;
      tasksList.style.display = `block`;
      /* create a new todo object */
      let todoItem = {
        id:
          previousData.length > 0
            ? previousData[previousData.length - 1].id + 1
            : 1,
        body: formTextField.value,
        status: false,
      };
      /* only the first commit to the localStorage */
      allTodos = [todoItem];
      /* a check for not replacing already existing localStorage data */
      if (!localStorage.getItem('allTodos')) {
        localStorage.setItem('allTodos', JSON.stringify(allTodos));
      } else {
        let newData = [...previousData, todoItem];
        localStorage.setItem('allTodos', JSON.stringify(newData));
      }
      formTextField.value = '';
      /* reflecting the added todo on the screen */
      window.location.reload();
    });
  };

  /**
   * Gets all stored data from localStorage & displays it on the screen.
   */
  const readTodo = () => {
    // display the default message if no previousData
    if (previousData.length == 0 || previousData == null) {
      tasksSubHeadline.style.display = `block`;
      tasksList.style.display = `none`;
    } else {
      tasksSubHeadline.style.display = `none`;
      tasksList.style.display = `block`;
    }

    // insert the list items into the dom
    previousData.forEach((dataItem) => {
      let listItem = `
         <li id=${dataItem.id} data-status=${dataItem.status} class="list-item">
           <span class="check-icon icon icon-sm"></span>
           <input class="listItemTextField" type="text" value="${dataItem.body}" required/>
           <span class="delete-icon icon icon-sm"></span>
         </li>`;
      tasksList.innerHTML += listItem;
    });
  };

  /**
   * Edits each the status & content of a todo & commits the changes to the localStorage.
   */
  const updateTodo = () => {
    // pressing the checkBtn
    tasksList.addEventListener('click', (e) => {
      if (e.target.classList.contains('check-icon')) {
        /* toggling the layout class */
        e.target.classList.toggle('checked-icon');
        e.target.nextElementSibling.classList.toggle('checked');
        /* changing the current status */
        if (e.target.parentElement.dataset.status == 'false') {
          e.target.parentElement.dataset.status = 'true';
        } else {
          e.target.parentElement.dataset.status = 'false';
        }
        let id = e.target.parentElement.id;
        let newStatus = e.target.parentElement.dataset.status;
        /* committing these changes to the localStorage */
        previousData.forEach((dataItem) => {
          if (dataItem.id == id) {
            if (newStatus == 'true') {
              dataItem.status = true;
            } else {
              dataItem.status = false;
            }
            localStorage.setItem('allTodos', JSON.stringify(previousData));
          }
        });
      }
    });

    // all listItemTextFields
    let listItemTextField = document.querySelectorAll('.listItemTextField');
    listItemTextField.forEach((txtField) => {
      /* listening to the changes the user made */
      txtField.addEventListener('keyup', () => {
        const elementId = txtField.parentElement.id;
        const newText = txtField.value;
        /* committing these changes to the localStorage */
        previousData.forEach((dataItem) => {
          if (dataItem.id == elementId) {
            dataItem.body = newText;
            localStorage.setItem('allTodos', JSON.stringify(previousData));
          }
        });
      });
    });

    // reflecting the updates on the screen
    const listItems = document.querySelectorAll('.list-item');
    previousData.forEach((dataItem) => {
      if (dataItem.status == true) {
        listItems.forEach((item) => {
          let checkIcon = item.firstElementChild;
          let listItemTextField = checkIcon.nextElementSibling;
          if (item.id == dataItem.id) {
            checkIcon.classList.add('checked-icon');
            listItemTextField.classList.add('checked');
          }
        });
      }
    });
  };

  /**
   * Deletes a todo and commits the deletion to the localStorage.
   */
  const deleteTodo = () => {
    // pressing the deleteBtn
    tasksList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-icon')) {
        /* change the screen layout and get the element id */
        tasksList.removeChild(e.target.parentElement);
        let elementId = e.target.parentElement.id;
        /* check the elementId against the localStorage dataItem id */
        previousData.forEach((dataItem, index) => {
          if (dataItem.id == elementId) {
            /* looping the retrieved localStorage array & removing the dataItem */
            previousData.splice(index, 1);
            /* commit the changes to the localStorage */
            localStorage.setItem('allTodos', JSON.stringify(previousData));
          }
        });
      }

      // reflecting the deletion on the screen
      const listItems = document.querySelectorAll('.list-item');
      /* for showing the default message if no listItem */
      if (listItems.length == 0) {
        tasksSubHeadline.style.display = `block`;
      }
    });
  };

  /** @function createTodo */
  createTodo();

  /** @function readTodo */
  readTodo();

  /** @function updateTodo */
  updateTodo();

  /** @function deleteTodo */
  deleteTodo();

  /* || New Created DOM Elements */
  listItems = document.querySelectorAll('.list-item');
  listItemsTextFields = document.querySelectorAll('.listItemTextField');
  checkBtns = document.querySelectorAll('.check-icon');
  deleteBtns = document.querySelectorAll('.delete-icon');
  allTextFields = document.querySelectorAll(`input[type = 'text']`);

  /**
   * Switches between two states of playing/pausing the sound.
   * @param {string} state - The state of sound.
   */
  const controlSound = (state) => {
    // sound assets
    configSound = new Audio('sound-effects/config.wav');
    optionSound = new Audio('sound-effects/option.wav');
    scrollSound = new Audio('sound-effects/arrow.wav');
    addSound = new Audio('sound-effects/add.wav');
    saveSound = new Audio('sound-effects/save.wav');
    cancelSound = new Audio('sound-effects/cancel.wav');
    checkSound = new Audio('sound-effects/check.wav');
    deleteSound = new Audio('sound-effects/delete.wav');

    // single buttons
    const soundBtns = [configBtn, addBtn, saveBtn, cancelBtn];

    // check about the state of 'UP'
    if (state == 'up') {
      /* call handleUserConfig(); to record the user preferences */
      handleUserConfig('up', body.dataset.mode, body.dataset.lang);
      /* playing the collective buttons */
      configOptions.forEach((opt) => {
        opt.addEventListener('click', () => {
          if (opt === audioBtns[0] || opt === audioBtns[1]) {
            optionSound.play();
          } else {
            optionSound.play();
          }
        });
      });
      checkBtns.forEach((btn) => {
        btn.addEventListener('click', () => checkSound.play());
      });
      deleteBtns.forEach((btn) => {
        btn.addEventListener('click', () => deleteSound.play());
      });
      scrollBtns.forEach((btn) => {
        btn.addEventListener('click', () => scrollSound.play());
      });
      /* playing the single buttons */
      soundBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          switch (btn) {
            case configBtn:
              configSound.play();
              break;

            case addBtn:
              addSound.play();
              break;

            case saveBtn:
              saveSound.play();
              break;

            case cancelBtn:
              cancelSound.play();
              break;
          }
        });
      });
    }

    // check about the state of 'MUTE'
    if (state == 'mute') {
      /* call handleUserConfig(); to record the user preferences */
      handleUserConfig('mute', body.dataset.mode, body.dataset.lang);
      /* pausing the collective buttons */
      configOptions.forEach((opt) => {
        opt.addEventListener('click', () => {
          if (opt === audioBtns[0] || opt === audioBtns[1]) {
            optionSound.play();
          } else {
            optionSound.pause();
          }
        });
      });
      checkBtns.forEach((btn) => {
        btn.addEventListener('click', () => checkSound.pause());
      });
      deleteBtns.forEach((btn) => {
        btn.addEventListener('click', () => deleteSound.pause());
      });
      scrollBtns.forEach((btn) => {
        btn.addEventListener('click', () => scrollSound.pause());
      });
      /* pausing the single buttons */
      soundBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          switch (btn) {
            case configBtn:
              configSound.pause();
              break;

            case addBtn:
              addSound.pause();
              break;

            case saveBtn:
              saveSound.pause();
              break;

            case cancelBtn:
              cancelSound.pause();
              break;
          }
        });
      });
    }
  };

  /**
   * Switches between two modes light/dark of the screen.
   * @param {string} mode - The screen display mode.
   */
  const controlMode = (mode) => {
    /* call handleUserConfig(); to record the user preferences */
    handleUserConfig(body.dataset.sound, mode, body.dataset.lang);
    /* restyling the elements */
    body.style.color = `var(--clr-txt-${mode})`;
    header.style.backgroundImage = `url(/images/${mode}-background.svg)`;
    logo.src = `/images/icons/logo-${mode}.svg`;
    main.style.backgroundImage = `url(/images/${mode}-background.svg)`;
    configBtn.style.backgroundImage = `url(/images/icons/cog-${mode}.svg)`;
    audioBtns[0].style.backgroundImage = `url(/images/icons/volume-${body.dataset.sound}-${mode}.svg)`;
    mobAudioBtn.style.backgroundImage = `url(/images/icons/volume-${body.dataset.sound}-mobile-${mode}.svg)`;
    modeBtns[0].style.backgroundImage = `url(/images/icons/mode-icon-${mode}.svg)`;
    mobModeBtn.style.backgroundImage = `url(/images/icons/mode-icon-mobile-${mode}.svg)`;
    const langBtns = [...arBtns, ...enBtns];
    langBtns.forEach((btn) => {
      if (btn.classList.contains('active')) {
        btn.style.cssText = `
      background: var(--clr-badge-${body.dataset.mode});
      color: var(--clr-badge-txt-${body.dataset.mode});`;
      } else {
        btn.style.cssText = ``;
      }
    });
    scrollDownBtn.style.backgroundImage = `url(/images/icons/arrow-down-${mode}.svg)`;
    scrollTopBtn.style.backgroundImage = `url(/images/icons/arrow-up-${mode}.svg)`;
    addBtn.style.backgroundImage = `url(/images/icons/add-${mode}.svg)`;
    formTextField.onfocus = () => {
      formTextField.style.outline = `3px solid var(--clr-txt-${mode})`;
      formTextField.style.borderRadius = `0.5rem`;
    };
    formTextField.onblur = () => (formTextField.style.outline = `0px`);
    saveBtn.style.background = `var(--clr-txt-${mode})`;
    cancelBtn.style.color = `var(--clr-txt-${mode})`;
    listItemsTextFields.forEach((txtField) => {
      if (txtField.classList.contains('checked')) {
        txtField.style.color = `var(--clr-txt-secondary);`;
      } else {
        txtField.style.color = `var(--clr-txt-${mode})`;
      }
      txtField.onfocus = () => {
        txtField.style.outline = `2px solid var(--clr-txt-${mode})`;
      };
      txtField.onblur = () => (txtField.style.outline = ``);
    });
    checkBtns.forEach((btn) => {
      if (btn.classList.contains('checked-icon')) {
        btn.style.backgroundImage = `url(/images/icons/checked-${mode}.svg)`;
      } else {
        btn.style.backgroundImage = `url(/images/icons/unchecked-${mode}.svg)`;
      }
      btn.addEventListener('click', () => {
        if (btn.classList.contains('checked-icon')) {
          btn.style.backgroundImage = `url(/images/icons/unchecked-${mode}.svg)`;
          btn.nextElementSibling.style.color = `var(--txt-clr-${mode})`;
        } else {
          btn.style.backgroundImage = `url(/images/icons/checked-${mode}.svg)`;
          btn.nextElementSibling.style.color = `var(--clr-txt-secondary)`;
        }
      });
    });
    deleteBtns.forEach((btn) => {
      btn.style.backgroundImage = `url(/images/icons/delete-${mode}.svg)`;
    });
  };

  /**
   * Switches between two languages arabic/english.
   * @param {string} lang - The language used through the app.
   */
  const controlLanguage = (lang) => {
    // all textual elements
    var langElements = [
      heroHeadline,
      heroSubHeadline,
      tasksHeadline,
      tasksSubHeadline,
      formTextField,
      saveBtn,
      cancelBtn,
    ];

    // check about the language if 'ARABIC'
    if (lang == 'ar') {
      /* call handleUserConfig(); to record the user preferences */
      handleUserConfig(body.dataset.sound, body.dataset.mode, 'ar');
      /* change the language to arabic */
      heroHeadline.textContent = `التنظيم هو كل شئ`;
      heroHeadline.style.fontSize = `clamp(5.8rem, calc(9 / 80 * 100vw), 14rem)`;
      heroSubHeadline.textContent = `لا تنتظر وابدأ في إضافة مهامك الآن!`;
      tasksHeadline.textContent = `مهامي`;
      tasksSubHeadline.textContent = `قائمة المهام الخاصة بك فارغة، الرجاء إضافة البعض!`;
      formTextField.placeholder = `إنشاء قائمة مهام...`;
      saveBtn.textContent = `حفظ`;
      cancelBtn.textContent = `إلغاء`;
      /* change the text direction to the right */
      langElements.forEach((element) => {
        element.style.direction = 'rtl';
        element.style.fontFamily = `var(--arabic-font)`;
      });
    }

    // check about the language if 'ENGLISH'
    if (lang == 'en') {
      /* call handleUserConfig(); to record the user preferences */
      handleUserConfig(body.dataset.sound, body.dataset.mode, 'en');
      /* change the language to english */
      heroHeadline.textContent = `Organization is Everything`;
      heroHeadline.style.fontSize = `clamp(4.8rem, calc(9 / 80 * 100vw), 12rem)`;
      heroSubHeadline.textContent = 'Don`t wait & start adding your tasks now!';
      tasksHeadline.textContent = `My Tasks`;
      tasksSubHeadline.textContent = `Your task list is empty, please add some!`;
      formTextField.placeholder = `Create a new todo...`;
      saveBtn.textContent = `Save`;
      cancelBtn.textContent = `Cancel`;
      /* change the text direction to the left */
      langElements.forEach((element) => {
        element.style.direction = 'ltr';
        element.style.fontFamily = `var(--main-font)`;
      });
    }
  };

  /**
   * The toggle value that changes across the toggle function.
   * @type {boolean}
   */
  var toggle = true;

  /**
   * Toggles between two states of the same function by pressing only one button.
   * @param {string} target - The targeted function to fire.
   */
  const toggleFunction = (target) => {
    if (toggle) {
      switch (target) {
        case 'mode':
          controlMode('dark');
          break;
        case 'sound':
          controlSound('up');
          break;
      }
    } else {
      switch (target) {
        case 'mode':
          controlMode('pink');
          break;
        case 'sound':
          controlSound('mute');
          break;
      }
    }
    toggle = !toggle;
  };

  /**
   * Fixes the text direction & the font families of all textual elements according to the language being used.
   * @example If the text content of a list item is in Arabic
   * it fixes the direction to be from right:left & changes the font family.
   * it works for already existing data or while typing.
   */
  const fixTextFieldsDirection = () => {
    // regular expressions to determine the language
    const arRegex = /^[\u0621-\u064A\u0660-\u0669 ]+$/;
    const enRegex = /^[a-zA-Z]+$/;

    // fix direction while typing
    allTextFields.forEach((field) => {
      field.addEventListener('keyup', () => {
        if (arRegex.test(field.value)) {
          field.style.direction = `rtl`;
          field.style.fontFamily = `var(--arabic-font)`;
        }
        if (enRegex.test(field.value)) {
          field.style.direction = `ltr`;
          field.style.fontFamily = `var(--main-font)`;
        }
      });
    });

    // fix direction of already existing data
    allTextFields.forEach((field) => {
      if (arRegex.test(field.value)) {
        field.style.fontFamily = `var(--arabic-font)`;
      }
      if (enRegex.test(field.value)) {
        field.style.fontFamily = `var(--main-font)`;
      }
    });

    // canceling typing arabic during english state
    if (body.dataset.lang == 'en' && formTextField.value == '') {
      formTextField.onblur = () => {
        formTextField.style.direction = 'ltr';
        formTextField.style.fontFamily = `var(--main-font)`;
      };
    }

    // canceling typing english during arabic state
    if (body.dataset.lang == 'ar' && formTextField.value == '') {
      formTextField.onblur = () => {
        formTextField.style.direction = 'rtl';
        formTextField.style.fontFamily = `var(--arabic-font)`;
      };
    }
  };

  /** @function fixTextFieldsDirection */
  fixTextFieldsDirection();

  /**
   * The default app configuration.
   * @type {object}
   * @property {string}  defaultConfig.sound - The default status of sound.
   * @property {string}  defaultConfig.mode  - The default status of mode.
   * @property {string}  defaultConfig.lang  - The default status of language.
   */
  const defaultConfig = {
    sound: 'mute',
    mode: 'pink',
    lang: 'en',
  };

  /**
   * Records the app user preferences to be used later & accordingly changes the body dataset object.
   * @param {string} sound comes from controlSound();.
   * @param {string} mode comes from controlMode();.
   * @param {string} lang comes from controlLanguage();.
   */
  const handleUserConfig = (sound, mode, lang) => {
    const userConfig = {
      sound: sound,
      mode: mode,
      lang: lang,
    };
    body.dataset.sound = sound;
    body.dataset.mode = mode;
    body.dataset.lang = lang;
    localStorage.setItem('userConfig', JSON.stringify(userConfig));
  };

  /**
   * The assumed previously-stored userConfig object in localStorage.
   * @type {object}
   */
  const userConfig =
    JSON.parse(localStorage.getItem('userConfig')) || defaultConfig;

  /* || The App First Usage.
     || in this case userConfig = defaultConfig */
  if (body.dataset.sound == '') {
    controlSound(userConfig.sound);
  }

  if (body.dataset.mode == '') {
    controlMode(userConfig.mode);
  }

  if (body.dataset.lang == '') {
    controlLanguage(userConfig.lang);
  }

  // Fixing the language badge according to the userConfig
  if (body.dataset.lang == 'ar') {
    arBtns.forEach((btn) => {
      btn.classList.add('active');
      btn.style.background = `var(--clr-txt-${body.dataset.mode})`;
      enBtns.forEach((btn) => {
        btn.classList.remove('active');
        btn.style.cssText = ``;
      });
    });
  }
  if (body.dataset.lang == 'en') {
    enBtns.forEach((btn) => {
      btn.classList.add('active');
      btn.style.background = `var(--clr-txt-${body.dataset.mode})`;
      arBtns.forEach((btn) => {
        btn.classList.remove('active');
        btn.style.cssText = ``;
      });
    });
  }

  /* || Some Event Listeners */

  // toggle the mobile configuration section
  configBtn.addEventListener('click', () => {
    configSection = document.querySelector('.config');
    configSection.classList.toggle('display-block');
    /* For Safari */
    document.body.scrollTop = 0;
    /* For Chrome, Firefox, IE and Opera */
    document.documentElement.scrollTop = 0;
  });

  // toggle the controlSound();
  audioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleFunction('sound');
      audioBtns[0].style.backgroundImage = `url(/images/icons/volume-${body.dataset.sound}-${body.dataset.mode}.svg)`;
      mobAudioBtn.style.backgroundImage = `url(/images/icons/volume-${body.dataset.sound}-mobile-${body.dataset.mode}.svg)`;
    });
  });

  // toggle the controlMode();
  modeBtns.forEach((btn) => (btn.onclick = () => toggleFunction('mode')));

  // toggle the badge between languages
  arBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      arBtns[i].classList.add('active');
      arBtns[i].style.background = `var(--clr-txt-${body.dataset.mode})`;
      enBtns.forEach((btn) => {
        btn.classList.remove('active');
        btn.style.cssText = ``;
      });
      controlLanguage('ar');
    });
  });
  enBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      enBtns[i].classList.add('active');
      enBtns[i].style.background = `var(--clr-txt-${body.dataset.mode})`;
      arBtns.forEach((btn) => {
        btn.classList.remove('active');
        btn.style.cssText = ``;
      });
      controlLanguage('en');
    });
  });

  // show/hide of addBtn & scrollTopBtn
  window.addEventListener('scroll', () => {
    console.log(window.pageYOffset);
    if (window.pageYOffset >= 400) {
      addBtn.style.display = `block`;
    } else {
      addBtn.style.display = `none`;
    }

    if (window.pageYOffset >= 1000) {
      scrollTopBtn.style.display = `block`;
    } else {
      scrollTopBtn.style.display = `none`;
    }
  });

  // scrolling to tasks section
  scrollDownBtn.addEventListener('click', () => {
    window.scrollTo(0, 700);
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo(0, 700);
  });
});
