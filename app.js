const http = require("http");
const { Telegraf } = require("telegraf");

const hostname = "127.0.0.1";
const port = 3000;
const bot = new Telegraf("5517715308:AAH1ypIeonFsPcs-bAzG3o-nAOAqk4OrA34");

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello Xami Xane");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

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

//Search action method
bot.action(["search", "choose"], (ctx) => {
  ctx.deleteMessage();

  let message = ` 
    የሚፈልጉትን አገልግሎት ይምረጡ፤ 
    
    ከዚያ መልዕክት መጻፊያው ላይ የሚፈልጉትን ህክምና ዓይነት ወይም የአገልግሎት ሰጪ ስም በመጻፍ  <b>አማራጮችን እስኪሰጥዎ ትንሽ ይጠብቁ። </b> 

    `;
  ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🏥 ሆስፒታል",
            switch_inline_query_current_chat: "H ",
          },
        ],
        [
          {
            text: "👨‍⚕️ ሐኪም ",
            switch_inline_query_current_chat: "D ",
          },
        ],
        [
          {
            text: "💊 መድኃኒት ",
            switch_inline_query_current_chat: "M ",
          },
        ],
        [
          {
            text: "🔬 ምርመራ ",
            switch_inline_query_current_chat: "L ",
          },
        ],
        [
          {
            text: "ወደ ዋናው ማውጫ ይመለሱ",
            callback_data: "start",
          },
        ],
      ],
    },
  });
});

bot.action("delivery", (ctx) => {
  ctx.reply("እባክዎን የመድኃኒቱን የሐኪም ማዘዣ ( Prescription ) ፎቶ ይላኩልን ።");
});
bot.context.db = {
  counter: 0,
  photoShare: null,
  user: null,
};

//Accept photo

bot.on("photo", (ctx, next) => {
  let photoArray;
  photoArray = ctx.message.photo;
  ctx.db[ctx.message.from.username] = photoArray[0].file_id;

  bot.telegram.sendMessage(
    ctx.chat.id,
    `እባክዎን ስልክ ቁጥርዎን ይጻፉልን፣
አልያም በዚሁ ቁጥር እንድንደውልልዎ <b>Share Contact </b> የሚለውን ቁልፍ ይጫኑ። `,
    {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [
          [
            {
              text: "Share Contact",
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );

  return next();
});

//Accept contact
bot.on("contact", (ctx, next) => {
  // console.log(ctx);
  let photoCaption = `
    Username:     @${ctx.message.from.username}

Name:     ${
    ctx.message.contact.first_name && ctx.message.contact.first_name
  }  ${ctx.message.contact.last_name && ctx.message.contact.last_name}

☎ phone Number:    ${ctx.message.contact.phone_number}
          `;

  //     );
  if (ctx.db[ctx.message.from.username]) {
    bot.telegram.sendPhoto(-574549488, ctx.db[ctx.message.from.username], {
      caption: photoCaption,
    });
    bot.telegram.sendMessage(
      ctx.chat.id,
      `እናመሰግናለን የተከበሩ ` +
        ctx.message.from.first_name +
        `  መድኃኒቱን ፈልገን የምንደውል ይሆናል ፣ ይጠብቁን።`,
      { reply_markup: { remove_keyboard: true } }
    );
  } else {
    ctx.reply("እባክዎን ቀድመው የመድኃኒቱን የሐኪም ማዘዣ ( Prescription ) ፎቶ ይላኩልን ።");
  }
  ctx.db[ctx.message.from.username] = null;
});

// Accept phone number

bot.hears(/^.*[0-9]+\d{9,13}$/, (ctx, next) => {
  let photoCaption = `
    Username:     @${ctx.message.from.username}

Name:     ${ctx.message.from.first_name && ctx.message.from.first_name}  ${
    ctx.message.from.last_name && ctx.message.from.last_name
  }

☎ phone Number:    ${ctx.message.text}
          `;

  //     );
  if (ctx.db[ctx.message.from.username]) {
    bot.telegram.sendPhoto(-574549488, ctx.db[ctx.message.from.username], {
      caption: photoCaption,
    });

    bot.telegram.sendMessage(
      ctx.chat.id,
      `እናመሰግናለን የተከበሩ ` +
        ctx.message.from.first_name +
        `  መድኃኒቱን ፈልገን የምንደውል ይሆናል ፣ ይጠብቁን።`,
      { reply_markup: { remove_keyboard: true } }
    );
  } else {
    ctx.reply("እባክዎን ቀድመው የመድኃኒቱን የሐኪም ማዘዣ ( Prescription ) ፎቶ ይላኩልን ።");
  }
  ctx.db[ctx.message.from.username] = null;
});

bot.launch();
