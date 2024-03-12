 var Webflow = Webflow || [];
  Webflow.push(function () {
    var wheelSpin = false, timeExpire = true;
    const offerTable = document.getElementById("offer_table"),
      offerTableDataSec = document.getElementById("today_offer_data"),
      offerDateSec = document.getElementById("expo-west-valid-date");
    const offerTableDataSecItem = offerTableDataSec.querySelectorAll(".w-dyn-item");
    const startDate = moment(offerDateSec.querySelector(".startdate-expo")?.innerHTML, "MMMM DD,YYYY"),
      endDate = moment(offerDateSec.querySelector(".enddate-expo")?.innerHTML, "MMMM DD,YYYY");
    if (offerTableDataSecItem.length) {
      offerTableDataSecItem.forEach((e, i) => {
        const postDate = moment(e.querySelector(".offer-created-date")?.innerHTML, "MMMM DD,YYYY");
        var stDuration = postDate.diff(startDate, 'days'),
          endDuration = endDate.diff(postDate, 'days');
        //console.log(stDuration, endDuration);
        if (isNaN(stDuration) || isNaN(endDuration)) {
          e.remove();
        }
        else {
          if (stDuration < 0 || endDuration < 0) {
            e.remove();
          }
        }
        if (i == offerTableDataSecItem.length - 1) {
          if (offerTableDataSec.querySelectorAll(".w-dyn-item").length == 0) {
            timeExpire = true;
          }
          offer();
        }
      })
    }
    else {
      wheelSpin = true;
      offer();
    }
    function offer() {
      //console.log("spinner_call");
      document.querySelector(".west-expo-block-right").style.opacity = 1;
      const modal = document.getElementById("form_modal"),
        wheelChart = document.getElementById("chart"),
        allOfferEndModal = document.querySelector(".expo-validate-alert"),
        offerDateExpireModal = document.querySelector(".offer-validate-exp"),
        offerTakenModal = document.querySelector(".offer_avail_msg_val");

      if (offerTableDataSec.querySelectorAll(".w-dyn-item").length == 0 && !wheelSpin) {
        offerDateExpireModal.classList.add('active');
      }
      else {
        offerDateExpireModal.remove();
      }

      var all_daily_emails = [];
      offerTableDataSec.querySelectorAll(".offer_user_emai").forEach((e) => {
        all_daily_emails.push(e.innerHTML);
      });
      var data = [];
      offerTable.querySelectorAll(".w-dyn-item").forEach((e) => {
        let allRowData = e.querySelectorAll("div");
        data.push({
          id: parseInt(Number(allRowData[0].innerHTML.toLowerCase().trim())),
          offer: allRowData[1].innerHTML
            .toLowerCase()
            .trim()
            .replace(/&amp;/g, "&"),
          TotalCount: parseInt(
            Number(allRowData[2].innerHTML.toLowerCase().trim())
          ),
          CurrentCount: 0,
          remaining: parseInt(
            Number(allRowData[2].innerHTML.toLowerCase().trim())
          ),
        });
      });
      const offerTableId = offerTable.querySelectorAll(".offer_id"),
        list = offerTableDataSec.querySelectorAll(".offer_id");
      offerTableId.forEach((e, v) => {
        var counter = 0;
        const offerData = e.innerHTML.toLowerCase().trim();
        for (var j = 0; j < list.length; j++) {
          const tableData = list[j].innerHTML.toLowerCase().trim();
          if (
            tableData != "" ||
            tableData != null ||
            tableData != undefined ||
            offerData != "" ||
            offerData != null ||
            offerData != undefined
          ) {
            if (tableData == offerData) {
              data[v].CurrentCount = ++counter;
              data[v].remaining = data[v].TotalCount - data[v].CurrentCount;
            }
          }
        }
      });

      //console.log(data.length);
      if (data.length != 0) {
        resetWheel();
      } else {
        alert("Page is not loaded properly, Please reload the Page.");
      }
      function resetWheel() {
        wheelChart.parentElement.classList.remove('inactive');
        allOfferEndModal.classList.remove('active');
        modal.classList.remove("show");
        wheelChart.classList.remove("complete");
        wheelChart.classList.remove("wait");
        document.querySelector(".slice.selected") != undefined
          ? document.querySelector(".slice.selected").classList.remove("selected")
          : null;
        modal.querySelectorAll(".ofr").forEach((w) => {
          w.value = "";
        });
        document.getElementById("data-user-name").innerHTML = "";
        if (wheelChart.querySelector(".chartsvg") != null) {
          wheelChart.querySelector(".chartsvg").remove();
        }
        rotator(data);

        offerTable.remove();
        offerTableDataSec.remove();
        offerDateSec.remove();
      }
      modal.querySelector("input[type='submit']").addEventListener("click", (p) => {
        let frm_data = modal.querySelector("input[type='email']").value.trim();
        if (frm_data.length > 0) {
          for (var j = 0; j < all_daily_emails.length; j++) {
            if (all_daily_emails[j] == frm_data) {
              p.preventDefault();
              resetWheel();
              // offerTable.remove();
              // offerTableDataSec.remove();
              //modal.remove();
              // wheelChart.remove();
              wheelChart.parentElement.classList.add("show_error");
              wheelChart.parentElement.classList.add('inactive');
              offerTakenModal.classList.add("active");
            }
          }
        }
      });
      function rotator(data) {
        const wheelSize = 500,
          offset = 25,
          fillColor = ["#f4203b", "#f0a833"],
          textColor = ["#000000", "#ffffff", "#FAFAD2"],
          padding = { top: 0, right: 0, bottom: 0, left: 0 };
        const prizes = data;
        var w = wheelSize - padding.left - padding.right,
          h = wheelSize - padding.top - padding.bottom,
          r = Math.min(w, h) / 2,
          rotation = 0,
          oldrotation = 0,
          picked = 100000,
          oldpick = [];
        for (let k = 0; k < prizes.length; k++) {
          var CurrentCount = prizes[k].CurrentCount,
            TotalCount = prizes[k].TotalCount;
          if (CurrentCount >= TotalCount) {
            oldpick.push(k);
          }
        }

        var svg = d3
          .select("#chart")
          .append("svg")
          .attr("class", "chartsvg")
          .data([prizes])
          .attr("width", w + padding.left + padding.right + offset * 2)
          .attr("height", h + padding.top + padding.bottom + offset * 2)
          .attr(
            "viewBox",
            `0 0 ${wheelSize + offset * 2} ${wheelSize + offset * 2}`
          );
        var container = svg
          .append("g")
          .attr("class", "chartholder")
          .attr(
            "transform",
            "translate(" +
            (w / 2 + padding.left + offset) +
            "," +
            (h / 2 + padding.top + offset) +
            ")"
          );
        container
          .append("circle")
          .style("stroke", "none")
          .style("fill", textColor[2])
          .attr("r", wheelSize / 2 + offset - 2)
          .attr("cx", 0)
          .attr("cy", 0);
        var vis = container.append("g");
        var pie = d3.layout
          .pie()
          .sort(null)
          .value(function (d) {
            return 1;
          });
        var arc = d3.svg.arc().outerRadius(r);
        var arcs = vis
          .selectAll("g.slice")
          .data(pie)
          .enter()
          .append("g")
          .attr("class", "slice");
        arcs
          .append("path")
          .attr("fill", function (d, i) {
            return fillColor[i % 2];
          })
          .attr("d", function (d) {
            return arc(d);
          });
        arcs
          .append("text")
          .attr("class", "wraptext")
          .attr("x", -10)
          .attr("y", 0)
          .attr("width", 170)
          .attr("fill", function (d, i) {
            return i % 2 ? textColor[0] : textColor[1];
          })
          .attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle) / 2;
            return (
              "rotate(" +
              ((d.angle * 180) / Math.PI - 90) +
              ")translate(" +
              (d.outerRadius - 10) +
              ")"
            );
          })
          .attr("text-anchor", "end")
          .text(function (d, i) {
            return prizes[i].offer;
          });
        d3.selectAll(".wraptext").call(wrap);
        arcs
          .append("circle")
          .style("stroke", "none")
          .style("fill", fillColor[0])
          .attr("r", 4)
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle) / 2;
            return (
              "rotate(" +
              ((d.angle * 180) / Math.PI - 67.5) +
              ")translate(" +
              (d.outerRadius + offset / 2 - 1.5) +
              ")"
            );
          });
        function wrap(text) {
          text.each(function () {
            var text = d3.select(this);
            var words = text.text().split(/\s+/).reverse();
            var lineHeight = 20;
            var width = parseFloat(text.attr("width"));
            var y = parseFloat(text.attr("y"));
            var x = text.attr("x");
            var anchor = text.attr("text-anchor");
            var tspan = text
              .text(null)
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("text-anchor", anchor);
            var lineNumber = 0;
            var line = [];
            var word = words.pop();
            while (word) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                lineNumber += 1;
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text
                  .append("tspan")
                  .attr("x", x)
                  .attr("y", y + lineNumber * lineHeight)
                  .attr("anchor", anchor)
                  .text(word);
              }
              word = words.pop();
            }
          });
        }

        if (oldpick.length == prizes.length && oldpick.length != 0) {
          allOfferEndModal.classList.add('active');
        }
        if (oldpick.length == prizes.length || offerTableDataSec.querySelectorAll(".w-dyn-item").length == 0 && !wheelSpin && oldpick.length != 0 && timeExpire) {
          wheelChart.parentElement.classList.add('inactive');
        } else {
          wheelSpin = true;
          container.on("click", spin);
        }

        function spin(d) {
          container.on("click", null);
          wheelChart.classList.add("wait");
          if (oldpick.length == prizes.length) {
            container.on("click", null);
            //allOfferEndModal.classList.add('active');
            wheelChart.parentElement.classList.add('inactive');
            return;
          }
          if (wheelSpin) {
            var ps = 360 / prizes.length,
              rng = Math.floor(Math.random() * 1440 + 360);
            rotation = Math.round(rng / ps) * ps;
            picked = Math.round(prizes.length - (rotation % 360) / ps);
            picked = picked >= prizes.length ? picked % prizes.length : picked;
            if (oldpick.indexOf(picked) !== -1) {
              d3.select(this).call(spin);
              return;
            } else {
              oldpick.push(picked);
            }
            rotation += 0 - Math.round(ps / 2);
            vis
              .transition()
              .duration(3000)
              .attrTween("transform", rotTween)
              .each("end", function () {
                wheelChart.classList.add("complete");
                d3.select(
                  ".slice:nth-child(" + (picked + 1) + ")"
                )[0][0].classList.add("selected");
                oldrotation = rotation;
                modal.classList.add("show");
                document.getElementById("mce-OFFERID").value = prizes[picked].id;
                document.getElementById("mce-OFFERNAME").value = prizes[picked].offer;
                document.getElementById("data-user-name").innerHTML = prizes[picked].offer;
                // console.log(prizes);
                wheelSpin = false;
              });
          }
        }
        function rotTween() {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function (t) {
            return "rotate(" + i(t) + ")";
          };
        }
      }
    }
  });
