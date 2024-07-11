
Difference between FileReader vs FileInputStream in Java? Answer
Even though both FileReader and FileInputStream are used to read data from a file in Java, they are quite different. The main difference between the FileReader and FileInputStream is that one reads data from a character stream while the other reads data from a byte stream. The FileReader automatically converts the raw bytes into characters by using the platform's default character encoding. This means you should use this class if you are reading from a text file that has the same character encoding as the default one.

If you happen to read a text file encoded in different character encoding then you should use InputStreamReader with specified character encoding. An InputStreamReader is a bridge between byte stream and character stream and can take a FileInputStream as a source.

Though, it's worth remembering that it caches the character encoding which means you cannot change the encoding scheme programmatically.

As per my recruitment experience, I have often found Java developers good on multi-threading, collections, and basics but fare really poor on Java IO. They struggle to answer questions like channel vs buffer, byte vs character, or IO vs NIO. If you ask them to write code, they never handle the exception, never close the file and hardly write production-quality code. An interview is a place to write your best code.

Brushing up your IO skills by reading Core Java for Really Impatient is also a good idea, as one reason for lacking Java IO knowledge is the lack of practice. This book, not only explains things well but also gives you lots of exercises to practice well.





Differences between FileReader and FileInputStream
Here are a couple of key differences between a FileReader and a FileInputStream in Java:

1) The first difference is in their type hierarchy, FileReader extends from Reader class while FileInputStream is descendent of InputStream class.

2) The second difference is in their purpose. The FileReader is meant for reading text data while FileInputStream is for reading binary data.

3) The various overloaded read() methods of FileReader can read one character at a time or multiple characters into an array while read() method of FileInputStream can read one byte at a time or multiple bytes in a byte array.

Here is a nice slide that explains the difference between FileReader and FileInputStream quite well:

Difference between FileReader vs FileInputStream in Java



Java Program to Read File using FileReader vs FileInpustStream
Let's see an example to learn how to use both FileReader and FileInputStream classes to read data from a text file. Remember, FileReader reads characters while FileInputStream reads bytes. In this program, I have just read the data from the manifest.mf file which is a text file.

```java
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;


/**
 * Java Program to demonstrate difference between
 * FileReader and FileInputStream in Java
 *
 * @author WINDOWS 8
 */
public class IteratorRemoveTest {

    public static void main(String args[]) throws IOException {

        // reading data using FileReader
        System.out.println("Reding text file using FileReader");
        try {
            FileReader fr = new FileReader("manifest.mf");
            int i = fr.read();

            while(i != -1){
                System.out.print((char)i);
                i = fr.read();
            }

        } catch (FileNotFoundException ex) {
            Logger.getLogger(IteratorRemoveTest.class.getName())
                       .log(Level.SEVERE, null, ex);
        }


        // reading data using FileInpustStream
        System.out.println("Reding text file using FileInputStream");
        try {

            FileInputStream fis = new FileInputStream("manifest.mf");
            int b = fis.read();

            while(b != -1){
                System.out.print(b);
                b = fis.read();
            }

        } catch (FileNotFoundException ex) {
            Logger.getLogger(IteratorRemoveTest.class.getName())
                 .log(Level.SEVERE, null, ex);
        }

    }

}
```
Output:
Reding text file using FileReader
Manifest-Version: 1.0
X-COMMENT: Main-Class will be added automatically by build

Reding text file using FileInputStream
7797110105102101115116458610111411510511111058324
9464813108845677977776978845832779710511045671089711511
53211910510810832981013297100100101100329711711611110997
11610599971081081213298121329811710510810013101310
BUILD SUCCESSFUL (total time: 0 seconds)


That's all on the difference between FileReader and FileInputStream in Java. So, use FileReader if you intend to read streams of character and use the FileInputSream if you want to read streams of raw bytes.

It's better to use FileReader for reading text files because it will take care of converting bytes to characters but remember that FileReader uses the platform's default character encoding. If you are reading a file that is encoded in a character encoding other than the host's default char encoding then you should use the InputStreamReader.

本文参考于[Java67](https://www.java67.com/2016/03/difference-between-filereader-vs.html)
