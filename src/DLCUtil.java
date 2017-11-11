import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Date;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.text.SimpleDateFormat;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.*;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class DLCUtil {
     private static final DLCConst CONST = new DLCConst();
     private boolean debug_on = false;
     private boolean assert_on = false;
     private boolean timestamp_on = false;

     long startTime;
     long endTime;
     String labelTime;
     String prefix = "-";


// ***************************************************************************************************************************     
// CODE-SECTION COnstructors
// 
// ***************************************************************************************************************************     
     DLCUtil() {
          super();
     }
     DLCUtil(boolean b) {
          super();
          this.debug_on = b;
          this.labelTime = "";
     }
// ***************************************************************************************************************************     
// CODE-SECTION Class_Variable_Control
// 
// ***************************************************************************************************************************     
     public String nothing(String sz)   { return (sz); }
     public String nothing(Double dd)   { return (dd.toString()); }
     public String nothing(int i)       { return (new Integer(i).toString()); }
     public DLCUtil Prefix(String sz)   { this.prefix = sz; return this; }
     public DLCUtil ClearPrefix()       { this.prefix = ""; return this; }
     public void setPrefix(String sz)   { this.prefix = sz; }
     public void setCaretPrefix()       { this.prefix = "> "; }
     public void unSetCaretPrefix()     { this.prefix = ""; }
     public void resetPrefix(String sz) { this.prefix = ""; }
// ***************************************************************************************************************************     
// CODE-SECTION Simple_String_Format
// 
// ***************************************************************************************************************************     
     public String dq(int n) {
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(n).append(CONST.DQ).toString());
     }
     public String dq(Date d) {
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(d).append(CONST.DQ).toString());
     }
     public String dq(Double dd) {
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(dd).append(CONST.DQ).toString());
     }
     public String dq(long ddd) {
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(ddd).append(CONST.DQ).toString());
     }
     public String dqcomma(int n) {
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(n).append(CONST.DQ).append(CONST.COMMA).toString());
     }
     public String dqcomma(Date d) { return "\""+d+"\",";  }
     public String dqcomma(Double dd) { return "\""+dd+"\",";  }
     public String dqcomma(long ddd) { return "\""+ddd+"\",";  }
     public String dqcomma(String sz) {
     StringBuilder sb = new StringBuilder();
     return (sb.append(CONST.DQ).append(nonull(sz)).append("\",").toString());
     }
     public String dqcolon(String sz) {
     StringBuilder sb = new StringBuilder();
     return (sb.append("\"").append(nonull(sz)).append("\": ").toString());
     }
     public String dq(String sz) {
     StringBuilder sb = new StringBuilder();
     return (sb.append("\"").append(nonull(sz)).append("\"").toString());
     }



// ***************************************************************************************************************************     
// CODE-SECTION JSON_String_Format
// 
// ***************************************************************************************************************************     
     public String json(Double dd) { 
          StringBuilder sb = new StringBuilder();
          return (sb.append("{").append(CONST.szDQV).append(":\"").append(dd.toString()).append("\"}").toString());
     }
     public String json(double dd) { 
          StringBuilder sb = new StringBuilder();
          Double d = new Double(dd);
          return (sb.append("{").append(CONST.szDQV).append(":\"").append(d.toString()).append("\"}").toString());
     }
     public String json(String sz1) { 
          StringBuilder sb = new StringBuilder();
          return (sb.append("{").append(CONST.szDQV).append(":\"").append(sz1).append("\"}").toString());
     }
     public String jsonc(String sz1) { 
          StringBuilder sb = new StringBuilder();
          return (sb.append("{").append(CONST.szDQV).append(":\"").append(sz1).append("\"}").append(CONST.szCOMMA).toString());
     }
     public String json(int i) { 
          String sz1 = new Integer(i).toString();
          StringBuilder sb = new StringBuilder();
          return (sb.append("{").append(CONST.szDQV).append(":\"").append(sz1).append("\"}").toString());
     }
     public String jsonc(int i) { 
          String sz1 = new Integer(i).toString();
          StringBuilder sb = new StringBuilder();
          return (sb.append("{").append(CONST.szDQV).append(":\"").append(sz1).append("\"}").append(CONST.szCOMMA).toString());
     }
     public String concatter(String pre, String post, String delim, String... args) { 
          StringBuilder sb = new StringBuilder(pre);
          for (int i=0;i<(args.length-1);i++) sb.append(args[i]).append(delim);
          return( sb.append(args[args.length-1]).append(post).toString() );           
     }
     public String jsonconcatter(String pre, String post, String delim, String... args) { 
          StringBuilder sb = new StringBuilder(pre);
          for (int i=0;i<(args.length-1);i++) sb.append(json(args[i])).append(delim);
          return( sb.append(json(args[args.length-1])).append(post).toString() );           
     }


// ***************************************************************************************************************************     
// CODE-SECTION Assertion
// 
// ***************************************************************************************************************************     
     public DLCUtil assert_on()  { this.assert_on = true; return this; }
     public DLCUtil assert_off() { this.assert_on = false; return this; }
     public DLCUtil assertion_on()  { this.assert_on = true; return this; }
     public DLCUtil assertion_off() { this.assert_on = false; return this; }
     public DLCUtil debugon() { this.debug_on = true; return this; }
     public DLCUtil debugoff() { this.debug_on = false; return this; }
     public DLCUtil debug_on() { this.debug_on = true; return this; }
     public DLCUtil debug_off() { this.debug_on = false; return this; }
     public DLCUtil timestamp_on()  { this.timestamp_on = true;  return this; }
     public DLCUtil timestamp_off() { this.timestamp_on = false; return this; }
     public DLCUtil ts_on()  { this.timestamp_on = true;  return this; }
     public DLCUtil ts_off() { this.timestamp_on = false; return this; }
     public DLCUtil assertion(boolean b, String... args) { 
          if (!b) for (int i=0;i<(args.length);i++) sysOut("ASSERTFAIL: " + args[i]);
          return this;
     }
     private String getTimeStamp(boolean b) { return b ? (new java.sql.Timestamp( (new java.util.Date()).getTime())).toString() : ""; }
// ***************************************************************************************************************************     
// CODE-SECTION Debug_Output
// 
// ***************************************************************************************************************************     
     public void sysOutTitles(boolean b) { 
          if (b) System.out.println("TimeStamp, Prefix, Trace, Message");
     }
     public void sysOut(boolean b, String... args) { 
          StringBuilder sb = new StringBuilder();
          if (b && debug_on) {
               String ts = getTimeStamp(true);
               String c=",";
//             String className = "";
//             if (!(this.obj == null)) className = (this.obj).getClass().getName();
//             https://docs.oracle.com/javase/7/docs/api/java/lang/StackTraceElement.html
//             String fullClassName = Thread.currentThread().getStackTrace()[3].getClassName();
//             String className     = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
//             String methodName    = Thread.currentThread().getStackTrace()[3].getMethodName();
//             int lineNumber       = Thread.currentThread().getStackTrace()[3].getLineNumber();
               String traceStamp    = Thread.currentThread().getStackTrace()[3].toString();

               for (int i=0;i<(args.length);i++) {
                    // String sz = "("+ (new Integer(args[i].length())).toString() + ")"; 
                    // System.out.println(ts +c+ sz +c+ this.prefix +c+ className +c+ args[i]);
                    // System.out.println(ts  +c+ this.prefix +c+ traceStamp +c+ className +c+ methodName +c+ lineNumber +c+ args[i]);
                    // System.out.println(ts +c+ this.prefix +c+ traceStamp +c+ args[i]);
                    System.out.println(sb.append(ts).append(c).append(this.prefix).append(c).append(traceStamp).append(c).append(args[i]).toString() ); 
                    sb.setLength(0);
               }
          }
     }
     public void sysOut(String... args) { 
          this.sysOut(true, args);
     }

     public String HTMLselect(String sz) { 
          return "<select>" + sz + "</select>";
     }

// ***************************************************************************************************************************     
// CODE-SECTION Utilities
// 
// ***************************************************************************************************************************     
public boolean regex(String sz, String regexpattern) {
     if (regexpattern.equals("")) return false;
     Pattern r = Pattern.compile(regexpattern);
     Matcher m = r.matcher(sz);
     return(m.find());
}

     public int sz2int(String sz) { 
         return(Integer.parseInt(sz.equals("") ? "0" : sz));
     }
     private String varStringConcat(String delimIn, String... args) { 
          String delim="";
          StringBuilder sb = new StringBuilder();
          for (int i=0;i<(args.length);i++) {
              sb.append(delim);
              sb.append(args[i]);
              delim=delimIn;
          }
          return sb.toString();
     }
     public String nonull(String sz,String pre,String post,String nix) {
         return ( ( sz  == null ) ? nix : (pre+sz+post)  );
     }
     public String nonull(String sz) {
          return ( ( sz  == null ) ? "-" : sz );
     }
     public String nonewlines(String sz) { 
          String str = this.nonull(sz);
          return(str.replaceAll("(\\r|\\n)", ""));
     } 
     public int mapInstanceStateCode(int n) { 
     int nRet = -1; 
     if ( n == 16 ) nRet = +1; 
     return nRet; 
     } 
     public String padding(String sz) { 
     String sb = ""; 
     int n = sz.length(); 
     for (int i=0;i<n;i++) sb = sb + " "; 
     return(sb); 
     } 
     public String padder(String sz, int m) { 
     String sb = ""; 
     int n = sz.trim().length(); 
     if ( n > m) n = m; 
     sb = sz.trim(); 
     for (int i=n;i<m;i++) sb = sb + " "; 
     return(sb); 
     } 
     public String padder(String sz) { 
     String sb = ""; 
     int m = 24; 
     int n = sz.trim().length(); 
     if ( n > m) n = m; 
     sb = sz.trim(); 
     for (int i=n;i<m;i++) sb = sb + " "; 
     return(sb); 
     }
     public String mapRegionCodesToNames(String sz) {
     String szRet = "";
     switch (sz) {
               case "E1":
                   szRet= "US East 1 (N. Virginia) Region";
                   break;
               case "E2":
                   szRet= "US East 2 (Ohio) Region";
                   break;
               case "W1":
                   szRet="West (N. California) Region";
                   break;
               case "W2":
                   szRet="US West (Oregon) Region";
                   break;
               case "A1":
                   szRet="AP 1";
                   break;
               case "A2":
                   szRet="AP 2";
                   break;
               case "A3":
                   szRet="AP 3";
                   break;
               case "S1":
                   szRet="SA 1";
                   break;
               case "U1":
                   szRet="EU 1";
                   break;
               case "U2":
                   szRet="EU 2";
                   break;
     }
     return (szRet);
}
     public void basicExceptionHandling(Exception e)  {
          System.out.println("Caught Exception: "+ e.getMessage());
          e.printStackTrace(System.out);
     }
     public String getStringParameter(HttpServletRequest req,String name) {
         String sz = req.getParameter(name);
         return ( (sz  == null) ? "" : sz );
     }
     public String getURLStringParameter(HttpServletRequest req,String name, String dft) {
         String sz = req.getParameter(name);
         if (sz == null) {
             // The req parameter 'param' was not present in the query string
             // e.g. http://hostname.com?a=b
             sz = dft;
         } else if ("".equals(sz)) {
             // The req parameter 'param' was present in the query string but has no value
             // e.g. http://hostname.com?param=&a=b
             sz = dft;
         }
         return (sz);
     }
     public int getURLIntParameter(HttpServletRequest req, String name, String dft) {
          String  sz = getURLStringParameter(req, name, dft);
          int n = Integer.parseInt(sz);
          return (n);
     }
     public String getProperties(String fn, String pn) {
          Properties prop = new Properties();
          InputStream input = null;
          String szRet = "";
          try {
                  input = new FileInputStream(fn);
                  // load a properties file
                  //prop.load(Thread.currentThread().getServletContext().getResourceAsStream("/WEB-INF/" + fn));
                  prop.load(input);
                  // get the property value and print it out
                  szRet = prop.getProperty(pn);
          } catch (IOException ex) {
                  ex.printStackTrace();
          } finally {
                  if (input != null) {
                          try {
                                  input.close();
                          } catch (IOException e) {
                                  e.printStackTrace();
                          }
                  }
          }
          return(szRet);
     }

     public String getAnchor(String url, String name) {
          StringBuilder sb = new StringBuilder();
          sb.append("<a target='_blank' href='").append(url).append("'>").append(name).append("</a>");
           return(sb.toString());
     }
     public String getStartAnchor(String env, String reg, String node) {
          return("<a href='"+ getStartUrl(env, reg, node) + "'>start</a>");
     }
     public String getStartUrl(String env, String reg, String node) {
       StringBuilder sb = new StringBuilder();
       sb.append("p1?env=").append(env)
                           .append("&loc=").append(reg)
                           .append("&node=").append(node)
                           .append("&op=").append("start");
          return(sb.toString());
     }
     public String getStopAnchor(String env, String reg, String node) {
          return("<a href='"+ getStopUrl(env, reg, node) + "'>stop</a>");
     }
     public String getStopUrl(String env, String reg, String node) {
       StringBuilder sb = new StringBuilder();
       sb.append("p1?env=").append(env)
                           .append("&loc=").append(reg)
                           .append("&node=").append(node)
                           .append("&op=").append("stop");
       return(sb.toString());
     }
     public String getServiceUrl(String env, String op,String qual,String node,String reg,int period,int hours) {
          StringBuilder sb = new StringBuilder();
       sb.append("p1?env=").append(env)
                           .append("&op=").append(op).append("&qual=").append(qual)
                           .append("&node=").append(node)
                           .append("&loc=").append(reg)
                           .append("&period=").append(Integer.toString(period))
                           .append("&hours=").append(Integer.toString(hours));
       return(sb.toString());
     }

     public void chartToCSV(String googleChartJson) {
              String path = "c:/temp/a/json.txt";
              try {
                     // Get CSV in list of strings
                     List<String> list = chartToCSVImpl(googleChartJson);
                     for (String s : list) {
                           System.out.println(s);
                     }
                     System.out.println(" ");
              } catch (JsonGenerationException e) {
                     e.printStackTrace();
              } catch (JsonMappingException e) {
                     e.printStackTrace();
              } catch (IOException e) {
                     e.printStackTrace();
              }

     }
     public List<String> chartToCSVImpl(String json) throws IOException, JsonParseException, JsonMappingException {
		List<String> list = new ArrayList<String>();
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> map = mapper.readValue(json, new TypeReference<Map<String, Object>>(){});
		@SuppressWarnings("unchecked")
		List<Map<String,String>> cols = (List<Map<String,String>>) map.get("cols");
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < cols.size(); i++) {
			if (sb.length() > 0) {
				sb.append(",");
			}
			String label = ((Map<String,String>)cols.get(i)).get("label");
			sb.append("\"").append(label).append("\"");
		}
		list.add(sb.toString());
		@SuppressWarnings("unchecked")
		List<Map<String,Object>> rows = (List<Map<String,Object>>) map.get("rows");
		for (int i = 0; i < rows.size(); i++) {
			sb = new StringBuilder();
			Map<String,Object> rowMap = (Map<String,Object>)rows.get(i);
			@SuppressWarnings("unchecked")
			List<Map<String,String>> values = (List<Map<String,String>>) rowMap.get("c");
			for (int j = 0; j < values.size(); j++) {
				if (sb.length() > 0) {
					sb.append(",");
				}
				String colVal =  ((Map<String,String>)values.get(j)).get("v");
				sb.append("\"").append(colVal).append("\"");
			}
			list.add(sb.toString());
		}
		return list;
	}



}

