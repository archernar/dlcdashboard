import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MyPrintWriter {
        private static final DLCUtil dlcutil = new DLCUtil(false);
        private PrintWriter pw;
        MyPrintWriter(HttpServletResponse resp) {
                super();
                try {
                        this.pw = resp.getWriter();
                } catch (Exception e) {
                     dlcutil.sysOut("Caught Exception: "+ e.getMessage());
                     e.printStackTrace(System.out);
                }
        }
        public void println(String sz) {
                this.pw.println(sz);
// String file = "BasicFileOutput.out";
// PrintWriter out = new PrintWriter( new BufferedWriter(new FileWriter(file)));
// out.println(sz);
// out.close();
        }
        public void println(char c) { this.pw.println(c); }
        public void print(char c) { this.pw.println(c); }
        public void println(Integer n) { this.pw.println(n); }
        public void print(Integer n) { this.pw.print(n); }
        public void print(String sz) { this.pw.print(sz); }
}

