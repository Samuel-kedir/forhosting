function startFunction() {
  let message = ` 
   <b>የሚያስፈልጎት አገልግሎት የትኛው ነው ? </b> 

የሆስፒታሎችን ፣ የሀኪሞችን ፣ የምርመራ ጣቢያ እና የመድኃኒት ቤቶችን አድራሻ ለማወቅ ፣ <b> <u>የህክምና መረጃ</u> </b>የሚለውን  ይጫኑ

በቀጥታ የታዘዘሎትን መድኃኒት ቤትዎ ድረስ እንዲመጣልዎ ከፈለጉ <b> <u>መድኃኒት ማዘዝ</u> </b>የሚለውን ይጫኑ
    

    `;

  bot.command(["start", "main"], (ctx) => {
    ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "የህክምና መረጃ ይፈልጉ ",
              callback_data: "search",
            },
          ],
          [
            {
              text: "💊መድኃኒት ለማዘዝ ",
              callback_data: "delivery",
            },
          ],
        ],
      },
    });
  });

  //Main Menu action method
  bot.action(["start", "menu"], (ctx) => {
    ctx.deleteMessage();
    ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "የህክምና መረጃ ይፈልጉ ",
              callback_data: "search",
            },
          ],
          [
            {
              text: "💊መድኃኒት ለማዘዝ ",
              callback_data: "delivery",
            },
          ],
        ],
      },
    });
  });
}

module.exports = { startFunction };
